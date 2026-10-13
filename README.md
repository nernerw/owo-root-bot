# Sudo OwO

An OwO-inspired social bot for Root, written in TypeScript. Its social
interactions are configured in JSON. Games, economy features, and an
app-owned database are not implemented.

## Social interactions

Interaction behavior lives in the small `src/social/` folder:

```text
src/social/
  actions.ts       Generic interaction handler; normally leave this alone
  actions.json     Which commands exist and their target rules
  templates.json   Random response text for each command
  giflinks.json    GIF URLs for each command
```

To add a command like `owo kiss`, add `"kiss"` to **each** JSON file:

In `actions.json`:

```json
"kiss": { "targetMode": "required" }
```

In `templates.json`:

```json
"kiss": {
  "withTarget": ["💋 Sends {{target}} a kiss!"],
  "withoutTarget": []
}
```

In `giflinks.json`:

```json
"kiss": ["https://media.giphy.com/media/YOUR_GIF_ID/giphy.gif"]
```

Put a comma after the previous JSON entry. `targetMode` can be `"required"`
(one Root mention required), `"optional"` (works with or without a mention), or
`"none"` (target not allowed). Use `{{target}}` in targeted response templates.
The `templates.json` and `giflinks.json` keys must match the action names in
`actions.json`. GIF lists may be empty. Any valid `http://` or `https://` link
is accepted, including links from Klipy, Giphy, Tenor, or other hosts; the link
does not have to end in `.gif`. The bot sends the link as message content and
does not fetch or download it. Whether Root shows a preview or animation
depends on Root's client and the kind of link.

`kill` is fictional, non-graphic roleplay only.

## Run and test

Requires Node.js 22 or newer and `@rootsdk/server-bot` 0.21.3.

```bash
npm ci
npm test
```

Set `DEV_TOKEN` in your local `.env` using the development token from Root.
Never commit or share the token. Run the local Root development host with
`npm run dev:root` (`npm run bot` is an alias).

## Render

Use a Render **Background Worker** with [`render.yaml`](./render.yaml). Set
`DEV_TOKEN` in the Render service environment; Render does not read your local
`.env`. The start command is `npm run render:start`. This runs the Root
development host remotely against the development community, not Root's
production runtime.

## Publish to Root

Root hosts published production bot packages. Set `ROOT_AUTH_TOKEN` from Root
Dev Portal → Settings → Tokens, then run `npm run root:publish`. This token is
for publishing; `DEV_TOKEN` is for the development host. Keep both private and
revoke/replace them if exposed.
