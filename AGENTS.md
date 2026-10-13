# Sudo OwO — Agent Guide

## Goal

Keep this Root bot small, runnable, and easy to change. Implement only features
the user asks for; games, economy, and database features are not implemented.

## Before changing code

- Read `README.md`, `package.json`, `root-manifest.json`, and the files being
  changed.
- Check the installed Root SDK before using Root events or API methods. Root is
  not Discord; do not use Discord libraries or assume Discord APIs exist.
- Preserve the Root starter, Render worker, secrets, and unrelated user changes.
- Never read out, print, commit, or ask the user to paste credentials.

## Simple project layout

- `src/main.ts` starts the Root bot and sends replies.
- `src/social/actions.ts` is the generic handler for configured interactions.
- `src/social/actions.json` defines action names and target rules.
- `src/social/templates.json` stores response text by action.
- `src/social/giflinks.json` stores GIF links by action.
- `tests/unit/social/actions.test.cjs` tests behavior without a
  Root token.

To add an interaction, add the same action name to all three JSON files. Set
`targetMode` to `required`, `optional`, or `none`, add response lists in
`templates.json`, and add GIF link strings (or an empty list) in
`giflinks.json`. Do not validate, rewrite, or fetch the configured link strings;
send them as entered.
Do not add a separate command handler. `kill` must remain fictional,
non-graphic roleplay.

Use Root's structured user references for targets. Do not treat typed `@text`
as a validated mention. Keep Root API calls in `src/main.ts` and keep
interaction behavior testable without connecting to Root.

## Verify changes

Run `npm test` after changing code or interaction data. It builds the project
and runs the unit tests. Do not claim live Root or Render behavior was verified
unless it was actually run there.

## Owner context

Do not commit `.sober/` or `.agents/`. Keep changes focused and do not create
planning or tracking files unless asked.
