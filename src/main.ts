import { rootServer } from "@rootsdk/server-bot";
import { registerSocialInteractionHandler } from "./platform/root/social-interactions";

async function onStarting(): Promise<void> {
  registerSocialInteractionHandler();
}

async function main(): Promise<void> {
  await rootServer.lifecycle.start(onStarting);
}

void main().catch((error: unknown) => {
  if (error instanceof Error) {
    console.error("Failed to start the Root bot:", error.message);
  } else {
    console.error("Failed to start the Root bot:", error);
  }
  process.exitCode = 1;
});
