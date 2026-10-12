export type SocialActionId =
  | "hug"
  | "smile"
  | "punch"
  | "kill"
  | "look"
  | "sad"
  | "happy"
  | "excited"
  | "jump"
  | "run"
  | "behind";

export type SocialTargetMode = "required" | "optional" | "none";

export interface SocialActionDefinition {
  readonly id: SocialActionId;
  readonly description: string;
  readonly usage: string;
  readonly targetMode: SocialTargetMode;
  readonly allowSelfTarget: boolean;
  readonly responses: {
    readonly withTarget: readonly string[];
    readonly withoutTarget: readonly string[];
  };
}

export const socialActions = {
  hug: {
    id: "hug",
    description: "Send someone a warm hug.",
    usage: "owo hug @someone",
    targetMode: "required",
    allowSelfTarget: false,
    responses: {
      withTarget: [
        "💞 A big, warm hug for {{target}}!",
        "🤗 {{target}} gets a cozy hug!",
        "💕 Wrapping {{target}} in a friendly hug!",
      ],
      withoutTarget: [],
    },
  },
  smile: {
    id: "smile",
    description: "Share a cheerful smile.",
    usage: "owo smile [@someone]",
    targetMode: "optional",
    allowSelfTarget: false,
    responses: {
      withTarget: [
        "😊 Sends a bright smile to {{target}}!",
        "✨ {{target}} gets a happy smile!",
      ],
      withoutTarget: ["😊 A bright smile!", "✨ Keep smiling!"],
    },
  },
  punch: {
    id: "punch",
    description: "Playfully punch someone in fictional roleplay.",
    usage: "owo punch @someone",
    targetMode: "required",
    allowSelfTarget: false,
    responses: {
      withTarget: [
        "🥊 Playfully bonks {{target}}!",
        "💥 A silly, harmless punch for {{target}}!",
        "👊 {{target}} gets a cartoon-style punch!",
      ],
      withoutTarget: [],
    },
  },
  kill: {
    id: "kill",
    description: "Stage a clearly fictional, non-graphic roleplay defeat.",
    usage: "owo kill @someone",
    targetMode: "required",
    allowSelfTarget: false,
    responses: {
      withTarget: [
        "🎭 In a clearly fictional scene, dramatically defeats {{target}}!",
        "🎬 {{target}} is playfully defeated in an imaginary scene!",
      ],
      withoutTarget: [],
    },
  },
  look: {
    id: "look",
    description: "Take a curious look around or at someone.",
    usage: "owo look [@someone]",
    targetMode: "optional",
    allowSelfTarget: false,
    responses: {
      withTarget: [
        "👀 Takes a curious look at {{target}}.",
        "🔎 {{target}} catches a curious glance!",
      ],
      withoutTarget: ["👀 Looks around curiously.", "🔎 Takes a closer look."],
    },
  },
  sad: {
    id: "sad",
    description: "Share a sad reaction.",
    usage: "owo sad",
    targetMode: "none",
    allowSelfTarget: false,
    responses: {
      withTarget: [],
      withoutTarget: ["😢 Feeling a little blue...", "🌧️ A quiet, sad moment."],
    },
  },
  happy: {
    id: "happy",
    description: "Share a happy reaction.",
    usage: "owo happy",
    targetMode: "none",
    allowSelfTarget: false,
    responses: {
      withTarget: [],
      withoutTarget: ["☀️ Feeling happy!", "🌼 Happiness all around!"],
    },
  },
  excited: {
    id: "excited",
    description: "Share an excited reaction.",
    usage: "owo excited",
    targetMode: "none",
    allowSelfTarget: false,
    responses: {
      withTarget: [],
      withoutTarget: ["🎉 Bursting with excitement!", "✨ Too excited to sit still!"],
    },
  },
  jump: {
    id: "jump",
    description: "Jump for joy.",
    usage: "owo jump",
    targetMode: "none",
    allowSelfTarget: false,
    responses: {
      withTarget: [],
      withoutTarget: ["🦘 Jumps for joy!", "⬆️ Up, up, and away!"],
    },
  },
  run: {
    id: "run",
    description: "Dash off at full speed.",
    usage: "owo run",
    targetMode: "none",
    allowSelfTarget: false,
    responses: {
      withTarget: [],
      withoutTarget: ["💨 Runs off at full speed!", "🏃 Gone in a flash!"],
    },
  },
  behind: {
    id: "behind",
    description: "Peek out from behind someone.",
    usage: "owo behind @someone",
    targetMode: "required",
    allowSelfTarget: false,
    responses: {
      withTarget: [
        "🙈 Peeks out from behind {{target}}!",
        "👀 Hides behind {{target}} and peeks around!",
      ],
      withoutTarget: [],
    },
  },
} satisfies Record<SocialActionId, SocialActionDefinition>;

export function isSocialActionId(value: string): value is SocialActionId {
  return Object.prototype.hasOwnProperty.call(socialActions, value);
}
