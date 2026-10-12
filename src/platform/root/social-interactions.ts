import {
  ChannelMessageCreatedEvent,
  ChannelMessageCreateRequest,
  ChannelMessageEvent,
  MessageType,
  RootApiException,
  rootServer,
} from "@rootsdk/server-bot";
import {
  executeSocialCommand,
  parseSocialCommand,
} from "../../features/social/interactions";

async function onMessage(evt: ChannelMessageCreatedEvent): Promise<void> {
  if (evt.messageType === MessageType.System) {
    return;
  }

  const command = parseSocialCommand(evt.messageContent);
  if (!command) {
    return;
  }

  const result = executeSocialCommand(command, {
    actorUserId: evt.userId,
    targets: (evt.referenceMaps?.users ?? []).map((user) => ({
      userId: user.userId,
      name: user.name,
    })),
  });

  const response: ChannelMessageCreateRequest = {
    channelId: evt.channelId,
    content: result.content,
  };

  try {
    await rootServer.community.channelMessages.create(response);
  } catch (error: unknown) {
    if (error instanceof RootApiException) {
      console.error("RootApiException:", error.errorCode);
    } else if (error instanceof Error) {
      console.error("Failed to send a social interaction:", error.message);
    } else {
      console.error("Failed to send a social interaction:", error);
    }
  }
}

export function registerSocialInteractionHandler(): void {
  rootServer.community.channelMessages.on(
    ChannelMessageEvent.ChannelMessageCreated,
    onMessage,
  );
}
