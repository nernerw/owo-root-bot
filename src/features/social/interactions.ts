import {
  isSocialActionId,
  SocialActionId,
  socialActions,
} from "./action-definitions";
import { GifCatalog, gifCatalog, selectRandomGif } from "./gif-catalog";

export interface ParsedSocialCommand {
  readonly actionId: SocialActionId;
  readonly hasArguments: boolean;
}

export interface SocialTarget {
  readonly userId: string;
  readonly name: string;
}

export interface SocialInteractionContext {
  readonly actorUserId: string;
  readonly targets: readonly SocialTarget[];
}

export interface SocialInteractionResult {
  readonly kind: "reply";
  readonly content: string;
}

export function parseSocialCommand(
  messageContent: string,
): ParsedSocialCommand | undefined {
  const match = /^owo\s+(\S+)(?:\s+([\s\S]*))?$/i.exec(messageContent.trim());
  const actionName = match?.[1]?.toLowerCase();

  if (!actionName || !isSocialActionId(actionName)) {
    return undefined;
  }

  return {
    actionId: actionName,
    hasArguments: Boolean(match?.[2]?.trim()),
  };
}

function choose<T>(items: readonly T[], random: () => number): T {
  const value = random();
  if (!Number.isFinite(value) || value < 0 || value >= 1) {
    throw new RangeError("The random source must return a number in [0, 1).");
  }

  const selected = items[Math.floor(value * items.length)];
  if (selected === undefined) {
    throw new Error("Cannot select a response from an empty template list.");
  }
  return selected;
}

function sanitizeDisplayName(name: string): string {
  return (
    name
      .replace(/[\u0000-\u001f\u007f]/g, " ")
      .replace(/\s+/g, " ")
      .replace(/@/g, "＠")
      .trim()
      .slice(0, 64) || "someone"
  );
}

function reply(content: string): SocialInteractionResult {
  return { kind: "reply", content };
}

export function executeSocialCommand(
  command: ParsedSocialCommand,
  context: SocialInteractionContext,
  random: () => number = Math.random,
  catalog: GifCatalog = gifCatalog,
): SocialInteractionResult {
  const action = socialActions[command.actionId];
  const target = context.targets[0];

  if (action.targetMode === "none") {
    if (command.hasArguments || context.targets.length > 0) {
      return reply(`This interaction does not use a target. Try \`${action.usage}\`.`);
    }
  } else {
    if (context.targets.length > 1) {
      return reply(`Please mention only one person. Usage: \`${action.usage}\`.`);
    }

    if (command.hasArguments && !target) {
      return reply(
        `Please mention a valid Root user. Usage: \`${action.usage}\`.`,
      );
    }

    if (action.targetMode === "required" && !target) {
      return reply(`Please mention someone. Usage: \`${action.usage}\`.`);
    }
  }

  if (
    target &&
    (typeof target.userId !== "string" ||
      !target.userId.trim() ||
      typeof target.name !== "string" ||
      !target.name.trim())
  ) {
    return reply("I couldn't identify that mentioned user. Please try again.");
  }

  if (
    target &&
    !action.allowSelfTarget &&
    target.userId === context.actorUserId
  ) {
    return reply("You can't target yourself with that interaction.");
  }

  const targetName = target ? sanitizeDisplayName(target.name) : undefined;
  const templates = target
    ? action.responses.withTarget
    : action.responses.withoutTarget;

  if (templates.length === 0) {
    throw new Error(`The "${command.actionId}" action has no response template.`);
  }

  const response = choose(templates, random).replace(
    /\{\{target\}\}/g,
    targetName ?? "someone",
  );
  const gifUrl = selectRandomGif(command.actionId, catalog, random);

  return reply(gifUrl ? `${response}\n${gifUrl}` : response);
}
