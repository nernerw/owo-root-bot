import {
  ChannelMessageCreatedEvent,
  ChannelMessageCreateRequest,
  ChannelMessageEvent,
  MessageType,
  RootApiException,
  rootServer,
} from "@rootsdk/server-bot";
import { getInteractionResponse } from "./social/actions";

async function onMessage(evt: ChannelMessageCreatedEvent): Promise<void> {
  if (evt.messageType === MessageType.System) {
    return;
  }

  const content = getInteractionResponse(
    evt.messageContent,
    evt.userId,
    (evt.referenceMaps?.users ?? []).map((user) => ({
      userId: user.userId,
      name: user.name,
    })),
  );

  if (!content) {
    return;
  }

  const message: ChannelMessageCreateRequest = {
    channelId: evt.channelId,
    content,
  };

  try {
    await rootServer.community.channelMessages.create(message);
  } catch (error: unknown) {
    if (error instanceof RootApiException) {
      console.error("RootApiException:", error.errorCode);
    } else if (error instanceof Error) {
      console.error("Could not send interaction:", error.message);
    } else {
      console.error("Could not send interaction:", error);
    }
  }
}

async function startBot(): Promise<void> {
  await rootServer.lifecycle.start(async () => {
    rootServer.community.channelMessages.on(
      ChannelMessageEvent.ChannelMessageCreated,
      onMessage,
    );
  });
}

void startBot().catch((error: unknown) => {
  console.error(
    "Could not start the Root bot:",
    error instanceof Error ? error.message : error,
  );
  process.exitCode = 1;
});
