# Sudo OwO

An OwO-inspired social and gaming bot for **Root**, built with TypeScript. Sudo OwO aims to bring fun social interactions, multiplayer games, virtual currency, user profiles, and community utilities to Root communities.

> **Development status:** Under active development. Features listed as planned are not necessarily implemented. Check the current code and official Root documentation before assuming a feature is available.

## Table of Contents

- [Sudo OwO](#sudo-owo)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Goals](#goals)
  - [Features](#features)
    - [Social interactions](#social-interactions)
    - [Games](#games)
    - [Virtual economy](#virtual-economy)
    - [Community utilities](#community-utilities)
  - [Planned Commands](#planned-commands)
  - [Project Structure](#project-structure)
  - [Technology](#technology)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [1. Get the project](#1-get-the-project)
    - [2. Inspect the project configuration](#2-inspect-the-project-configuration)
    - [3. Install dependencies](#3-install-dependencies)
    - [4. Configure credentials](#4-configure-credentials)
    - [5. Run the project](#5-run-the-project)
  - [Configuration](#configuration)
  - [Development](#development)
    - [Recommended first milestone](#recommended-first-milestone)
  - [Architecture](#architecture)
    - [Core](#core)
    - [Root platform adapter](#root-platform-adapter)
    - [Features](#features-1)
    - [Data](#data)
    - [Tests](#tests)
  - [Security and Fairness](#security-and-fairness)
  - [Testing](#testing)
  - [Development Roadmap](#development-roadmap)
    - [Phase 1 — Foundation](#phase-1--foundation)
    - [Phase 2 — Social interactions](#phase-2--social-interactions)
    - [Phase 3 — Game framework](#phase-3--game-framework)
    - [Phase 4 — First games](#phase-4--first-games)
    - [Phase 5 — Economy](#phase-5--economy)
    - [Phase 6 — Reliability](#phase-6--reliability)
  - [Contributing](#contributing)
  - [Documentation](#documentation)
  - [License](#license)

## Overview

Sudo OwO is designed to be a modular, extensible bot with a focus on social interactions and games.

Its long-term goals include:

- Animated GIF reactions and randomized social messages.
- Single-player and multiplayer games.
- Card, board, party, casino-style, and puzzle games.
- A virtual economy with wallets, rewards, inventory, and shops.
- User profiles, statistics, and leaderboards.
- Community utilities and helpful commands.

The project targets Root specifically. Root SDK APIs, event handling, message formats, permissions, configuration, and deployment must follow the official Root documentation and the installed SDK version.

Sudo OwO is not a Discord bot. Discord-specific libraries and APIs must not be used unless a separate integration is explicitly required.

## Goals

The project follows these principles:

1. **Modularity:** Features should be independent and reusable.
2. **Type safety:** Use TypeScript types and validate untrusted input.
3. **Reliability:** Handle errors, duplicate events, and invalid actions safely.
4. **Fairness:** Game outcomes and economy changes must be determined by trusted server-side logic.
5. **Testability:** Keep core business logic testable without connecting to Root.
6. **Extensibility:** Adding a command, social action, or game should not require rewriting the entire application.
7. **Honest documentation:** Clearly distinguish implemented features from planned features.

## Features

The following is the intended feature set, not a guarantee that every feature is currently available.

### Social interactions

Planned actions include:

- `hug`
- `smile`
- `punch`
- `kill` — fictional roleplay only
- `look`
- `sad`
- `happy`
- `excited`
- `jump`
- `run`
- `behind`

Social actions are intended to support reusable response templates, optional GIFs, and appropriate target validation.

### Games

Planned game categories include:

- **Casino-style:** Blackjack, roulette, slots, dice, coin flip, baccarat, poker, and keno.
- **Card games:** UNO, War, Go Fish, Crazy Eights, Old Maid, Hearts, and Spades.
- **Party games:** Trivia, guessing games, reaction challenges, and word challenges.
- **Board games:** Tic-tac-toe, Connect Four, chess, checkers, Reversi, and Battleship.
- **Word games and puzzles:** Hangman, anagrams, riddles, memory games, and number guessing.
- **Arcade games:** Snake, 2048, and other self-contained games.

Each game should implement its own rules and use shared infrastructure only where appropriate.

### Virtual economy

Planned economy features include:

- Wallets and balances.
- Daily rewards.
- Game wagers and payouts.
- Inventory and collectibles.
- A virtual shop.
- Statistics and leaderboards.

The economy uses virtual currency. Balance changes must go through a centralized transaction service, with safeguards against duplicate payouts, invalid wagers, and negative balances.

### Community utilities

Planned utilities include:

- Help and command information.
- User profiles.
- Statistics.
- Reminders.
- Daily rewards.
- Community-specific configuration, where supported.

## Planned Commands

The intended command prefix is `owo`. The exact parsing rules and supported mention formats depend on the Root SDK.

| Example | Intended purpose |
|---|---|
| `owo help` | Display available commands |
| `owo hug @someone` | Send a hug interaction |
| `owo smile` | Send a smile interaction |
| `owo blackjack` | Start or play blackjack |
| `owo profile` | Display a user profile |

These are examples of intended behavior, not confirmation that the commands are already registered or functional. Consult the actual implementation and help output for the current supported command list.

## Project Structure

The repository is organized by feature and responsibility.

```text
owo-root-bot/
├── AGENTS.md
├── README.md
├── .env.example
├── .gitignore
├── src/
│   ├── main.ts
│   ├── core/
│   ├── platform/
│   │   └── root/
│   ├── data/
│   │   ├── migrations/
│   │   ├── repositories/
│   │   ├── schemas/
│   │   └── seed/
│   ├── features/
│   │   ├── social/
│   │   ├── games/
│   │   ├── economy/
│   │   └── utility/
│   └── shared/
└── tests/
    ├── fixtures/
    ├── integration/
    └── unit/
```

Some directories may contain placeholders until their features are implemented. The actual repository may evolve as the official Root starter and SDK requirements are verified.

## Technology

- **Language:** TypeScript.
- **Platform:** Root.
- **Runtime:** The runtime required by the official Root bot starter.
- **SDK:** The compatible Root SDK version specified by the starter.
- **Testing:** The test runner configured in the project.
- **Persistence:** To be selected or integrated based on verified platform and runtime capabilities.

Do not assume a particular package manager, database, test framework, or deployment command until it has been confirmed by the project configuration and official documentation.

## Getting Started

### Prerequisites

Before running the bot, make sure you have:

- Git.
- The runtime required by the official Root starter.
- The package manager used by the project.
- Access to the required Root bot credentials and configuration.
- The official Root bot starter or the corresponding project configuration.

### 1. Get the project

If you already have the repository locally:

```bash
cd ~/Documents/owo-root-bot
```

If you are setting it up on another machine, clone your repository using its actual Git URL.

### 2. Inspect the project configuration

Check the available files and scripts:

```bash
ls -la
```

```bash
cat package.json
```

If `package.json` does not exist, obtain the correct official Root starter files before attempting to install dependencies or run the bot.

### 3. Install dependencies

Use the package manager and lockfile that the project actually provides.

For example, if the repository uses npm and has a `package-lock.json`:

```bash
npm ci
```

Do not run this command if the required lockfile is absent. Follow the official starter's installation instructions instead.

### 4. Configure credentials

Inspect `.env.example` and the official Root configuration requirements.

Create a local `.env` only if the project's configuration loader supports it:

```bash
cp .env.example .env
```

Set `DEV_TOKEN` to the token value only (do not include a second `DEV_TOKEN=` prefix):

```dotenv
DEV_TOKEN=your-dev-token-value
```

Edit it using your preferred text editor and supply the required values locally. Never commit real credentials. If a token is accidentally exposed in terminal output or chat, revoke it in the Root Dev Portal and generate a replacement.

### 5. Run the project

Use the scripts defined in the actual `package.json` and the official Root starter documentation. The development, build, and deployment commands are intentionally not hardcoded here because they must match the installed SDK and runtime.

## Configuration

Configuration should be validated at startup.

Use `.env.example` to document required environment variables with placeholder values only. The real configuration must follow the official Root starter.

Typical configuration categories may include:

- Bot credentials or authentication.
- Environment mode.
- Logging level.
- Optional feature settings.
- Storage configuration, if required.

These are categories, not guaranteed environment variable names. Use only settings supported by the actual project.

**Never commit:**

- Real bot tokens.
- API keys.
- Production credentials.
- Private configuration files.
- User secrets.

Keep `.env` ignored by Git whenever it is used for local secrets.

## Development

Before implementing a feature:

1. Read `AGENTS.md`.
2. Inspect the existing code and configuration.
3. Verify the relevant Root SDK APIs against official documentation.
4. Identify the smallest set of files that need to change.
5. Implement the feature using the existing architecture.
6. Add tests for the relevant behavior.
7. Run available type checks, tests, and build checks.
8. Update this README when supported functionality changes.
9. Report what was implemented, what was tested, and what remains incomplete.

Prefer one working feature at a time over creating many unfinished modules.

### Recommended first milestone

The first milestone is a working Root integration and one end-to-end social command:

`owo hug @someone`

This should include:

- Root bot initialization.
- A verified message-event integration.
- Command parsing and registration.
- Target validation using Root's actual user or mention representation.
- A reusable response template.
- A text fallback when no GIF is available.
- Appropriate error handling.
- Tests for the command's business logic.

Only mark the milestone complete after the implementation has been checked and the relevant tests have actually passed.

## Architecture

### Core

The core layer provides shared application infrastructure, such as configuration, logging, errors, command routing, validation, and cooldowns.

### Root platform adapter

The adapter in `src/platform/root/` isolates platform-specific APIs from application logic.

Feature modules should not create their own competing Root clients or event listeners.

### Features

Each feature owns its business logic:

- `social/` — actions, templates, and GIF selection.
- `games/` — game rules, sessions, and reusable game infrastructure.
- `economy/` — wallets, transactions, rewards, inventory, and shops.
- `utility/` — help, profiles, reminders, and statistics.

### Data

Repositories and storage services should provide a consistent persistence interface. The actual storage technology must be chosen based on verified project requirements.

### Tests

Tests should cover pure business logic separately from Root integration wherever possible.

## Security and Fairness

Sudo OwO should:

- Validate untrusted inputs and stored data.
- Avoid exposing credentials or stack traces.
- Enforce permissions using verified platform capabilities.
- Validate game moves against authoritative server-side state.
- Prevent duplicate economy transactions and payouts.
- Use concurrency-safe balance updates.
- Handle cancelled games and failed wagers without silently losing currency.
- Avoid claiming provable fairness without a verifiable implementation.

All currency is virtual and has no real-world monetary value by default.

## Testing

Use the testing tools already configured in the repository.

Important test areas include:

- Command parsing and argument validation.
- Social action target handling.
- GIF selection and empty-catalog fallbacks.
- Game rules, turns, and session lifecycle.
- Wallet calculations and transaction idempotency.
- Wager validation and payout calculations.
- Error handling and invalid input.

Unit tests should not require production bot credentials. Platform integration tests should use verified SDK interfaces and appropriate test doubles where possible.

## Development Roadmap

### Phase 1 — Foundation

- [ ] Verify and preserve the official Root starter.
- [ ] Confirm SDK and runtime versions.
- [ ] Implement Root initialization and the platform adapter.
- [ ] Implement command parsing and registration.
- [ ] Add logging and centralized error handling.
- [ ] Verify one working command.

### Phase 2 — Social interactions

- [ ] Implement the GIF catalog.
- [ ] Implement randomized response templates.
- [ ] Implement `owo hug @someone`.
- [ ] Add remaining social actions.
- [ ] Add help and usage information.

### Phase 3 — Game framework

- [ ] Implement game registration.
- [ ] Implement session lifecycle.
- [ ] Add player and turn validation.
- [ ] Add invitations and lobbies where supported.

### Phase 4 — First games

- [ ] Implement a simple game.
- [ ] Implement blackjack.
- [ ] Add further games incrementally.
- [ ] Test game rules and edge cases.

### Phase 5 — Economy

- [ ] Select and implement persistence.
- [ ] Implement wallets and transactions.
- [ ] Add daily rewards.
- [ ] Add validated wagers and payouts.
- [ ] Add inventory, shops, and leaderboards.

### Phase 6 — Reliability

- [ ] Expand automated test coverage.
- [ ] Add session cleanup and resource management.
- [ ] Improve operational logging.
- [ ] Verify deployment and secret management.
- [ ] Document implemented commands and limitations.

## Contributing

Contributions should follow the architecture and quality rules in `AGENTS.md`.

When submitting a change:

- Keep the change focused.
- Follow existing TypeScript and formatting conventions.
- Add or update tests where appropriate.
- Do not introduce unverified Root APIs.
- Do not commit credentials.
- Update documentation for user-visible changes.
- State any untested behavior or known limitations.

## Documentation

- **Project instructions:** `AGENTS.md`
- **Official Root documentation:** Use the official Root documentation for SDK, runtime, permissions, configuration, and deployment details.
- **Command reference:** Use the implemented command registry and help output once available.

## License

No license has been specified yet. Add a `LICENSE` file and update this section before distributing the project publicly.
