# SUDO OWO — MASTER AI DEVELOPMENT GUIDE

## 1. PROJECT IDENTITY

Project name: Sudo owo

Platform: Root — a community and messaging platform similar to Discord.

Language: TypeScript.

Runtime: The runtime and SDK versions required by the official Root bot starter.

Architecture: Modular, feature-oriented, strongly typed, testable, and extensible.

Primary purpose: Create a social interaction bot inspired by OwO-style bots, featuring animated GIF reactions, multiplayer games, virtual currency, profiles, and community utilities.

This document is the primary development contract for AI coding agents working on this repository.

The goal is not merely to generate code. The goal is to build a maintainable, secure, reliable bot that can grow to support many commands and games without requiring architectural rewrites.

---

## 2. MANDATORY RULES FOR AI AGENTS

Before changing anything:

1. Read this entire file.
2. Read `README.md`.
3. Inspect the current directory structure.
4. Inspect `package.json`, the Root manifest, and the existing entry point if present.
5. Identify the actual Root SDK, its version, and the APIs it supports.
6. Read the existing implementation of any module being modified.
7. Check available tests and scripts before choosing how to validate changes.

Never assume that a planned feature already exists.

Never claim a feature is implemented merely because its files exist.

Never claim tests passed unless they were actually executed successfully.

Never invent Root SDK classes, methods, events, permissions, message formats, or deployment commands.

When documentation or the SDK is unavailable, clearly identify the uncertainty and ask for the necessary information rather than fabricating an implementation.

Preserve working functionality. Avoid unnecessary rewrites.

Do not overwrite existing project configuration without understanding its purpose.

Do not install dependencies without checking whether they are necessary and compatible with the project's runtime.

Prefer small, coherent, verifiable changes over massive untested code generation.

---

## 3. ROOT PLATFORM INTEGRATION

Root is the target platform. It is not Discord.

Do not import Discord.js or use Discord-specific APIs unless a separate, explicitly requested integration requires them.

Do not assume that Discord embeds, slash commands, intents, buttons, select menus, permissions, reactions, or gateway events have direct Root equivalents.

Use the official Root documentation and installed SDK as the source of truth.

Verify the supported APIs for:

- Bot initialization and lifecycle.
- Message events and message delivery.
- User and member identity.
- Community and channel identity.
- Mentions and message formatting.
- Commands and event subscriptions.
- Interactive components, if available.
- Permissions and access control.
- Persistent storage.
- Development and production configuration.
- Testing and deployment.

### Platform adapter

All platform-specific operations belong in:

`src/platform/root/`

This layer is responsible for translating Root events and API responses into application-level types and operations.

Feature modules must not independently initialize Root clients or create competing event listeners.

Keep the platform integration replaceable so the application logic can be tested without connecting to Root.

Never use fabricated SDK methods to make an example appear complete.

If the official SDK uses a different structure from the planned architecture, adapt the architecture to the real SDK rather than forcing the SDK into an incompatible design.

---

## 4. ARCHITECTURE OVERVIEW

Use feature-oriented modular architecture.

Expected project structure:

- `src/main.ts` — application bootstrap and lifecycle.
- `src/core/` — command routing, configuration, logging, errors, permissions, cooldowns, and shared infrastructure.
- `src/platform/root/` — Root SDK integration.
- `src/features/social/` — social interactions and GIF management.
- `src/features/games/` — game framework and individual games.
- `src/features/economy/` — wallets, transactions, rewards, inventory, shops, and leaderboards.
- `src/features/utility/` — help, profiles, daily rewards, reminders, and statistics.
- `src/data/` — repositories, persistence, schemas, and migrations.
- `src/shared/` — shared types, constants, utilities, validation, and formatting.
- `tests/` — unit, integration, and regression tests.

Each feature should own its domain logic.

Keep these responsibilities separate:

- Input parsing.
- Input validation.
- Business logic.
- Persistence.
- Platform communication.
- Output formatting.
- Error handling.

Avoid giant files containing unrelated commands.

Avoid circular dependencies.

Avoid importing internal implementation details from unrelated features.

Use dependency injection or explicit service parameters when dependencies need to be shared.

Do not create abstractions without a clear use case. Prefer simple interfaces that support current requirements and predictable future extensions.

---

## 5. COMMAND SYSTEM

All commands must use a common command contract and centralized registration system.

Expected responsibilities:

- Parse incoming command text.
- Identify the command and its arguments.
- Resolve aliases.
- Build a typed command context.
- Validate arguments.
- Apply permissions and cooldowns.
- Execute the command.
- Handle expected failures.
- Return an appropriate response through the Root adapter.

Keep command parsing independent of Root-specific event objects.

### Command requirements

Every command should define:

- Canonical name.
- Aliases, when needed.
- Description.
- Usage examples.
- Required arguments.
- Optional arguments.
- Target requirements.
- Permission requirements, if applicable.
- Cooldown policy, if applicable.
- Execution logic.
- Expected errors.

Commands should register through a central registry.

Adding a new command should not require modifying a large conditional statement containing every existing command.

Detect duplicate names and aliases during registration.

Unknown commands should fail gracefully.

Invalid arguments should produce helpful usage information.

Do not expose stack traces, tokens, or internal exception details to users.

### Command syntax

The intended command prefix is:

`owo`

Examples:

- `owo help`
- `owo hug @someone`
- `owo smile`
- `owo blackjack`
- `owo profile`

The exact parsing of prefixes, mentions, and user identifiers must match the capabilities of the Root SDK.

Do not assume a mention is represented as a literal string. Use the platform's actual structured mention data when available.

Avoid requiring a target for actions that are designed to work without one.

---

## 6. SOCIAL INTERACTION SYSTEM

Social interactions are one of the primary features.

Initial actions:

- hug
- smile
- punch
- kill
- look
- sad
- happy
- excited
- jump
- run
- behind

The action list must be extensible.

Each action should have a definition containing its identifier, description, target requirements, response templates, and GIF catalog key.

Keep the action definitions separate from command parsing and platform delivery.

### Target behavior

Targeted actions should support a valid Root user mention or identifier.

Non-targeted actions should work without a target.

Validate targets before executing the action.

Handle missing targets, invalid identifiers, self-targeting, and unavailable user information according to the action's configured policy.

Actions such as `kill` are fictional roleplay interactions. They must not perform real-world actions.

### Response generation

Responses may include:

- Actor display name.
- Target display name.
- Randomized text template.
- Selected GIF URL.

Use a centralized template renderer.

Validate template variables and safely format user-provided names.

Do not duplicate response-generation logic in every action module.

### GIF catalog

Store GIFs separately from command implementation.

Use:

`src/features/social/gif-catalog.ts`

Maintain separate lists for each action.

Example conceptual structure:

- hug: list of hug GIF URLs.
- smile: list of smile GIF URLs.
- punch: list of punch GIF URLs.
- kill: list of fictional action GIF URLs.
- sad: list of sad GIF URLs.
- happy: list of happy GIF URLs.

Continue the same pattern for all registered actions.

The catalog should support:

- Adding URLs without editing command handlers.
- Random selection.
- Empty-list handling.
- URL validation.
- Catalog inspection and statistics.
- Future configuration-based loading.
- Optional duplicate avoidance when practical.

Only use GIF formats and URL hosts compatible with the actual Root message API.

Do not assume that every website URL is a direct GIF URL.

Do not fetch arbitrary URLs from user messages automatically.

If a catalog is empty, send a graceful text-only response or a clear fallback.

Never make a missing GIF crash the bot.

---

## 7. GAME FRAMEWORK

Games must be independent modules built on a shared framework.

Do not implement all games in one file.

Each game should provide the functionality it actually needs through a consistent interface.

The framework should support:

- Game registration.
- Game metadata.
- Player validation.
- Session creation.
- Session state.
- Turn management.
- Player joining and leaving.
- Invitations and lobbies.
- Game start and finish.
- Cancellation.
- Timeouts and cleanup.
- State validation.
- Result reporting.
- Optional spectator support.
- Optional virtual-currency wagering.

Not every game needs every capability.

Single-player games should not require multiplayer lobby infrastructure unnecessarily.

### Game metadata

Where appropriate, define:

- Unique game identifier.
- Display name.
- Description.
- Aliases.
- Minimum player count.
- Maximum player count.
- Supported modes.
- Whether wagering is supported.
- Whether a game is turn-based.
- Configuration and rules.

Validate all player counts and game settings before starting a session.

### Game lifecycle

A game session may transition through:

- waiting
- active
- finished
- cancelled

Enforce valid transitions.

Reject actions against finished or cancelled sessions.

Prevent two players from making conflicting moves simultaneously.

Persist sessions only when necessary and only through the shared persistence layer.

Implement expiration and cleanup for abandoned sessions.

Do not trust client-provided game state. Validate every move against authoritative server-side state.

---

## 8. GAME CATALOG

The following are planned candidates, not claims that these games already exist.

### Casino-style games

- Blackjack.
- Roulette.
- Slots.
- Dice.
- Coin flip.
- Baccarat.
- Poker.
- Keno.
- Higher or lower.
- Wheel-style games.

Additional games may be added through the same registration mechanism.

### Card games

- UNO.
- War.
- Go Fish.
- Crazy Eights.
- Old Maid.
- Hearts.
- Spades.
- Other compatible card games.

Implement each game's actual rules independently.

Do not reuse rules from one game merely because both use cards.

For games with complex rules, write the rules down and test them before integrating the messaging interface.

### Party games

- Trivia.
- Guessing games.
- Would you rather.
- Higher or lower.
- Reaction challenges.
- Word challenges.

### Board games

- Tic-tac-toe.
- Connect Four.
- Chess.
- Checkers.
- Reversi.
- Battleship.

### Word games and puzzles

- Wordle-style games.
- Hangman.
- Anagrams.
- Word chains.
- Riddles.
- Memory games.
- Number guessing.
- Minesweeper.

### Arcade and strategy

- Snake.
- 2048.
- Other self-contained arcade games.

### Multiplayer infrastructure

Potential shared capabilities:

- Matchmaking.
- Private matches.
- Player invitations.
- Rematches.
- Match history.
- Leaderboards.
- Spectators.
- Tournaments.

Implement advanced infrastructure only when needed by real game modules.

---

## 9. GAME RULES AND FAIRNESS

Game logic must be independent of messaging and presentation.

A game should accept validated inputs and produce validated state transitions.

For every game:

- Validate all player actions.
- Reject illegal moves.
- Enforce turn order.
- Handle ties and terminal states.
- Prevent duplicate submissions.
- Ensure results are determined by server-side rules.
- Test boundary conditions.
- Document important rule variations.

Use a suitable random-number generator for game mechanics.

For ordinary entertainment games, use a well-tested random implementation.

For wagering systems, do not rely on client-side randomness or client-provided results.

Where meaningful monetary-style virtual wagers exist, use a cryptographically secure random source for random outcomes, with a well-defined and testable design.

Do not claim that a game is provably fair unless an implemented and independently verifiable protocol actually supports that claim.

---

## 10. ECONOMY SYSTEM

The economy uses virtual currency.

It must remain separate from individual games.

Expected components:

- Wallet service.
- Transaction service.
- Rewards service.
- Inventory service.
- Shop service.
- Leaderboards.
- Economy repositories.
- Economy types.

Potential features:

- Wallet balance.
- Daily rewards.
- Activity rewards.
- Game wagers.
- Payouts.
- Refunds.
- Inventory items.
- Collectibles.
- Purchases.
- Transfers, if deliberately supported.
- Statistics and rankings.

### Critical balance rules

Never let a game modify a wallet balance directly.

All balance-changing operations must go through the transaction service.

A transaction should have a unique identifier and sufficient information to audit its result.

Validate sufficient funds before accepting a wager.

Prevent negative balances unless a separately designed mechanic explicitly permits them.

Use atomic transactions or an equivalent concurrency-safe mechanism supported by the actual storage backend.

Prevent duplicate payouts when an event or request is retried.

Ensure cancellation and failure paths do not silently consume a player's wager.

Use idempotency keys where appropriate.

Record the reason for each balance change.

Do not trust client-provided balances, wager results, payout amounts, or player ownership.

Virtual currency must not be represented as real money or redeemable value unless the platform and applicable requirements explicitly support that functionality.

---

## 11. DATA AND PERSISTENCE

Use the storage facilities supported by the official Root SDK.

Do not assume a database or storage feature exists until it has been verified.

All persistent data access should go through repositories or dedicated storage services.

Do not scatter database queries throughout commands and game handlers.

Potential entities:

- User profile.
- User statistics.
- Wallet.
- Transaction.
- Inventory item.
- Game session.
- Game history.
- Community configuration.
- Cooldown record, when persistence is necessary.

Use stable identifiers from the actual Root platform.

Do not use display names as primary identifiers.

Validate data before saving and after loading.

Handle missing, outdated, and corrupted records gracefully.

Add migrations or explicit versioning when the storage system supports them.

Avoid storing redundant state that can be safely derived.

Never store secrets in ordinary user records.

---

## 12. SECURITY AND PERMISSIONS

Treat all incoming messages, arguments, identifiers, and stored records as potentially invalid.

Validate user input at system boundaries.

Prevent unauthorized access to administrative or privileged operations.

Use Root's actual permission model after verifying its capabilities.

Do not invent permission flags.

Protect against:

- Malformed input.
- Command abuse.
- Excessive requests.
- Duplicate event delivery.
- Concurrent wallet updates.
- Unauthorized game moves.
- Forged targets or player identifiers.
- Invalid wagers.
- Resource exhaustion.
- Accidental secret disclosure.

Apply cooldowns where they improve reliability and prevent spam.

Cooldowns must use stable user identifiers and the appropriate command scope.

Do not expose secrets in logs, user responses, error reports, or committed files.

Never print the complete environment or token-bearing configuration.

Use environment variables or Root's official secret-management facilities where appropriate.

Do not add arbitrary shell execution, dynamic code evaluation, or unsafe deserialization to feature modules.

---

## 13. CONFIGURATION

Separate configuration from business logic.

Validate configuration at startup.

Provide safe defaults only for optional settings.

Fail clearly when a required configuration value is missing.

Do not silently replace invalid required settings with misleading defaults.

Keep an example environment file containing placeholders only.

Never commit `.env` or production credentials.

Do not assume that a local `.env` file is automatically loaded. Verify the project's configuration loader and runtime.

Use Root's supported development and deployment secret mechanisms.

---

## 14. ERROR HANDLING AND LOGGING

Use centralized error handling.

Distinguish between:

- Validation errors.
- Unknown commands.
- Missing users.
- Missing resources.
- Permission failures.
- Cooldown violations.
- Game-rule violations.
- Storage failures.
- Platform API failures.
- Unexpected internal errors.

User-facing errors should be short and actionable.

Internal logs should contain enough context to debug failures without exposing secrets or unnecessary personal data.

Do not swallow exceptions silently.

Do not log the same failure repeatedly at multiple layers without a reason.

Use structured logging when practical.

Never send stack traces to ordinary users.

---

## 15. TESTING REQUIREMENTS

Write tests alongside implementation.

Use the test runner already supported by the project.

Do not add a second testing framework without a concrete need.

### Unit tests

Test pure business logic independently of Root.

Important targets:

- Command parsing.
- Argument validation.
- Social action definitions.
- GIF selection.
- Empty GIF catalogs.
- Game registration.
- Player count validation.
- Game rules.
- Turn order.
- Session lifecycle.
- Wallet calculations.
- Transaction idempotency.
- Wager validation.
- Payout calculations.

### Integration tests

Test the interaction between modules using mocks or test doubles where appropriate.

Do not require a production token for ordinary unit tests.

Test platform integration against the real SDK interfaces.

### Regression tests

When fixing a bug, add a test that reproduces it whenever practical.

After modifying a game, rerun the tests relevant to that game and its shared framework.

Never remove or weaken tests merely to make a build pass.

---

## 16. CODE QUALITY

Use strict TypeScript settings where compatible with the official starter.

Prefer explicit types for public interfaces.

Avoid `any`. When an external SDK returns uncertain data, validate it and narrow its type.

Use clear, descriptive names.

Keep functions focused and reasonably small.

Avoid unnecessary abstractions, duplicated logic, magic numbers, and hidden side effects.

Prefer immutable inputs and explicit state transitions where practical.

Handle asynchronous operations carefully.

Do not create unhandled promise rejections.

Avoid blocking operations in message-processing paths.

Use comments to explain important decisions rather than restating obvious code.

Use consistent formatting and import conventions.

Follow the existing project's module system and linting rules.

Do not assume every TypeScript project uses the same import extensions or compiler settings.

---

## 17. AI-ASSISTED FEATURE DEVELOPMENT

When asked to add a feature, follow this process:

1. Inspect the existing architecture.
2. Identify the smallest set of modules that need to change.
3. Confirm the relevant Root SDK capabilities.
4. Define the feature's public interface.
5. Implement business logic separately from platform integration.
6. Add registration and configuration.
7. Add input validation and error handling.
8. Write or update tests.
9. Run the available type checker, tests, and build.
10. Update README.md and related documentation.
11. Summarize changed files, completed behavior, and remaining limitations.

Do not create multiple competing implementations of the same service.

Do not modify unrelated files.

Do not generate hundreds of empty files merely to make the architecture appear complete.

Create modules when they provide a real responsibility or a clear extension point.

When a task is too large, implement one working vertical slice at a time.

If required information is missing, ask a concise question or clearly state the assumption before proceeding.

---

## 18. ADDING A NEW SOCIAL ACTION

To add a social action:

1. Add its identifier to the social action type.
2. Add its metadata and response templates.
3. Add its GIF catalog entry.
4. Define whether it requires a target.
5. Register the command using the shared command system.
6. Implement only action-specific behavior.
7. Add tests for target handling and GIF selection.
8. Update the command documentation.

Do not duplicate the message-sending implementation for every action.

The goal is to make adding an ordinary new action require minimal changes.

---

## 19. ADDING A NEW GAME

To add a game:

1. Create a dedicated directory under the correct game category.
2. Define the game's rules and supported player counts.
3. Implement its state and legal transitions.
4. Register it through the game registry.
5. Reuse session, lobby, and turn services where appropriate.
6. Integrate wagering only if the game supports it.
7. Use the economy transaction service for all balance changes.
8. Add unit tests for rules, edge cases, and terminal states.
9. Add integration tests where needed.
10. Document commands and rule variations.

A new game must not require editing the command router's internal logic.

Avoid coupling one game to another game's internal state.

---

## 20. PERFORMANCE AND RESOURCE MANAGEMENT

Design for many users and active game sessions.

Avoid unnecessary global state.

Use explicit ownership and lifecycle management for sessions.

Expire inactive sessions when appropriate.

Clean up timers, listeners, and resources when sessions finish.

Do not create unbounded in-memory maps without a cleanup strategy.

Use pagination for potentially large histories and leaderboards when supported.

Avoid repeatedly loading the same expensive data without a reason.

Do not introduce caching until invalidation and consistency requirements are understood.

---

## 21. DOCUMENTATION

README.md should describe:

- Project purpose.
- Supported commands.
- Features implemented.
- Features planned.
- Development setup.
- Configuration.
- Testing.
- Build and deployment instructions.
- Known limitations.

Clearly distinguish implemented features from planned features.

Document every command's syntax and behavior.

Document unusual game rules and economy policies.

When an API or architectural decision changes, update the relevant documentation.

Prefer official Root references for platform-specific instructions.

---

## 22. DEFINITION OF DONE

A feature is complete only when:

- Its behavior is implemented.
- It follows the architecture.
- It uses verified Root APIs where platform integration is involved.
- Inputs and state transitions are validated.
- Errors are handled.
- Tests have been added where appropriate.
- Relevant tests pass.
- Type checking and build checks pass when available.
- Documentation is updated.
- Secrets and sensitive information are protected.
- Any known limitations are stated honestly.

A folder, interface, placeholder, or TODO is not a completed feature.

A successful local build does not by itself prove that the bot works on Root.

---

## 23. DEVELOPMENT PRIORITIES

Follow this order unless the user explicitly changes priorities.

### Phase 1 — Foundation
- Inspect and preserve the official Root starter.
- Verify SDK initialization.
- Implement the platform adapter.
- Implement command parsing and registration.
- Implement logging and error handling.
- Verify a minimal working command.

### Phase 2 — Social system
- Implement the GIF catalog.
- Implement random GIF selection.
- Implement response templates.
- Implement `owo hug @someone`.
- Add remaining social actions.
- Add help and usage information.

### Phase 3 — Game framework
- Implement the game registry.
- Implement sessions and lifecycle.
- Implement player validation.
- Implement turn management.
- Implement multiplayer invitations where supported.

### Phase 4 — First games
- Implement a simple game.
- Implement blackjack.
- Add additional card and party games.
- Add further games incrementally.

### Phase 5 — Economy
- Implement persistence.
- Implement wallets and transactions.
- Add daily rewards.
- Add validated wagers and payouts.
- Add inventory, shops, and leaderboards.

### Phase 6 — Reliability
- Expand automated tests.
- Add session cleanup.
- Improve operational logging.
- Verify deployment and secret management.
- Document supported functionality.

---

## 24. FINAL PRINCIPLE

Build a real, testable Root bot — not a collection of impressive-looking files.

Keep the platform adapter accurate, the social system data-driven, games independent, and the economy centralized.

Make every new feature easier to add than the previous one.

When choosing between fast code generation and reliable architecture, prefer the simplest reliable implementation that satisfies the user's requirements.
