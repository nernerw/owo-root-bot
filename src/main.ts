import {
  rootServer,
  MessageType,
  ChannelMessageEvent,
  ChannelMessageCreatedEvent,
  ChannelMessageCreateRequest,
  RootApiException,
} from "@rootsdk/server-bot";

function getMentionTarget(evt: ChannelMessageCreatedEvent): string | undefined {
  const mentionName = evt.referenceMaps?.users?.[0]?.name;
  if (mentionName) {
    return mentionName;
  }

  const mentionMatch = evt.messageContent.match(/@([A-Za-z0-9._-]+)/);
  return mentionMatch?.[1];
}

async function onMessage(evt: ChannelMessageCreatedEvent): Promise<void> {
  if (evt.messageType === MessageType.System) {
    return;
  }

  const content = evt.messageContent.trim();
  if (!content.toLowerCase().startsWith("owo")) {
    return;
  }

  const commandText = content.replace(/^owo\s+/i, "").trim();
  if (!commandText) {
    return;
  }

  const [verb, ...rest] = commandText.split(/\s+/);
  if (verb?.toLowerCase() !== "hug") {
    return;
  }

  const rawTarget = rest.join(" ").trim();
  const targetName = rawTarget || getMentionTarget(evt) || "someone";

  const response: ChannelMessageCreateRequest = {
    channelId: evt.channelId,
    content:
      targetName === "someone"
        ? "💞 *hugs someone warmly*"
        : `💞 *hugs ${targetName} warmly*`,
  };

  try {
    await rootServer.community.channelMessages.create(response);
  } catch (error: unknown) {
    if (error instanceof RootApiException) {
      console.error("RootApiException:", error.errorCode);
    } else if (error instanceof Error) {
      console.error("Unexpected error:", error.message);
    } else {
      console.error("Unknown error:", error);
    }
  }
}

async function onStarting(): Promise<void> {
  rootServer.community.channelMessages.on(
    ChannelMessageEvent.ChannelMessageCreated,
    onMessage,
  );
}

(async () => {
  await rootServer.lifecycle.start(onStarting);
})();
