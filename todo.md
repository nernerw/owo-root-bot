# Project foundation todo list

Foundation is restored using the official Root starter package names and files. Runtime verification still requires the real Root token and community setup.

- [x] Obtain the official Root bot starter patterns and verify the exact runtime, SDK, and manifest requirements.
- [x] Install the correct project config files from the official starter (package metadata, TypeScript config, env example, and scripts).
- [x] Verify Root bot initialization and message event APIs using the actual installed `@rootsdk/server-bot` package.
- [x] Implement the Root platform bootstrap and message listener in the real starter structure.
- [x] Add command parsing for `owo` and support for the first social action: `owo hug @someone`.
- [ ] Validate target users, handle missing/invalid mentions, and add a graceful fallback when no GIF is available.
- [ ] Run the bot with a real `DEV_TOKEN` and a live Root community to confirm the command works before adding more features.