import actionData from "./actions.json";
import gifData from "./giflinks.json";
import templateData from "./templates.json";

type TargetMode = "required" | "optional" | "none";

interface Action {
  readonly targetMode: TargetMode;
  readonly responses: {
    readonly withTarget: readonly string[];
    readonly withoutTarget: readonly string[];
  };
  readonly gifs: readonly string[];
}

interface MentionedUser {
  readonly userId: string;
  readonly name: string;
}

const directGifUrl =
  /^https:\/\/media\.giphy\.com\/media\/[A-Za-z0-9_-]+\/giphy\.gif$/;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringList(value: unknown, label: string): readonly string[] {
  if (
    !Array.isArray(value) ||
    !value.every((item: unknown) => typeof item === "string")
  ) {
    throw new Error(`${label} must be a list of strings.`);
  }
  return value;
}

function loadActions(
  rawActions: unknown,
  rawTemplates: unknown,
  rawGifs: unknown,
): ReadonlyMap<string, Action> {
  if (!isObject(rawActions) || !isObject(rawTemplates) || !isObject(rawGifs)) {
    throw new Error("actions.json, templates.json, and giflinks.json must be JSON objects.");
  }

  const names = Object.keys(rawActions);
  for (const [label, entries] of [
    ["templates.json", rawTemplates],
    ["giflinks.json", rawGifs],
  ] as const) {
    const missing = names.find(
      (name) => !Object.prototype.hasOwnProperty.call(entries, name),
    );
    const extra = Object.keys(entries).find(
      (name) => !Object.prototype.hasOwnProperty.call(rawActions, name),
    );
    if (missing || extra) {
      throw new Error(`${label} action names must match actions.json.`);
    }
  }

  const loaded = new Map<string, Action>();
  for (const name of names) {
    const config = rawActions[name];
    const templates = rawTemplates[name];
    const gifs = rawGifs[name];

    if (!/^[a-z][a-z0-9_-]*$/.test(name) || !isObject(config)) {
      throw new Error(`Invalid action "${name}" in actions.json.`);
    }
    if (
      config.targetMode !== "required" &&
      config.targetMode !== "optional" &&
      config.targetMode !== "none"
    ) {
      throw new Error(`"${name}".targetMode must be required, optional, or none.`);
    }
    if (!isObject(templates)) {
      throw new Error(`"${name}" must have templates in templates.json.`);
    }

    const withTarget = stringList(templates.withTarget, `${name}.withTarget`);
    const withoutTarget = stringList(
      templates.withoutTarget,
      `${name}.withoutTarget`,
    );
    const gifLinks = stringList(gifs, `${name} GIF links`);

    if (
      (config.targetMode !== "none" && withTarget.length === 0) ||
      (config.targetMode !== "required" && withoutTarget.length === 0)
    ) {
      throw new Error(`"${name}" is missing a response template.`);
    }
    if (!gifLinks.every((url) => directGifUrl.test(url))) {
      throw new Error(`"${name}" must use direct Giphy GIF links.`);
    }

    loaded.set(name, {
      targetMode: config.targetMode,
      responses: { withTarget, withoutTarget },
      gifs: gifLinks,
    });
  }

  return loaded;
}

const actions = loadActions(actionData, templateData, gifData);

function choose<T>(items: readonly T[], random: () => number): T | undefined {
  if (items.length === 0) {
    return undefined;
  }
  const value = random();
  if (!Number.isFinite(value) || value < 0 || value >= 1) {
    throw new RangeError("The random source must return a number in [0, 1).");
  }
  return items[Math.floor(value * items.length)];
}

function cleanName(name: string): string {
  return (
    name
      .replace(/[\u0000-\u001f\u007f]/g, " ")
      .replace(/\s+/g, " ")
      .replace(/@/g, "＠")
      .trim()
      .slice(0, 64) || "someone"
  );
}

export function getInteractionResponse(
  message: string,
  actorId: string,
  mentionedUsers: readonly MentionedUser[],
  random: () => number = Math.random,
): string | undefined {
  const command = /^owo\s+([a-z][a-z0-9_-]*)(?:\s+([\s\S]*))?$/i.exec(
    message.trim(),
  );
  const name = command?.[1]?.toLowerCase();
  const action = name ? actions.get(name) : undefined;
  if (!action) {
    return undefined;
  }

  const hasArguments = Boolean(command?.[2]?.trim());
  const target = mentionedUsers[0];

  if (action.targetMode === "none") {
    if (hasArguments || mentionedUsers.length > 0) {
      return `That interaction doesn't use a target. Try \`owo ${name}\`.`;
    }
  } else {
    if (mentionedUsers.length > 1) {
      return "Please mention only one person.";
    }
    if (hasArguments && !target) {
      return `Please mention a valid Root user for \`owo ${name}\`.`;
    }
    if (action.targetMode === "required" && !target) {
      return `Please mention someone for \`owo ${name}\`.`;
    }
  }

  if (target && (!target.userId.trim() || !target.name.trim())) {
    return "I couldn't identify that mentioned user. Please try again.";
  }
  if (target?.userId === actorId) {
    return "You can't target yourself with that interaction.";
  }

  const response = choose(
    target ? action.responses.withTarget : action.responses.withoutTarget,
    random,
  );
  if (!response) {
    throw new Error(`"${name}" is missing a response template.`);
  }

  const text = response.replace(
    /\{\{target\}\}/g,
    target ? cleanName(target.name) : "someone",
  );
  const gif = choose(action.gifs, random);
  return gif ? `${text}\n${gif}` : text;
}
