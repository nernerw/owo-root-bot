const assert = require("node:assert/strict");
const test = require("node:test");

const actions = require("../../../dist/social/actions.json");
const templates = require("../../../dist/social/templates.json");
const giflinks = require("../../../dist/social/giflinks.json");
const { getInteractionResponse } = require("../../../dist/social/actions.js");

const actorId = "root-user-1";
const mention = { userId: "root-user-2", name: "Rin" };
const firstChoice = () => 0;

test("every configured action responds to its command", () => {
  for (const [name, config] of Object.entries(actions)) {
    const usesTarget = config.targetMode === "required";
    const response = getInteractionResponse(
      `owo ${name}${usesTarget ? " @Rin" : ""}`,
      actorId,
      usesTarget ? [mention] : [],
      firstChoice,
    );

    assert.ok(response, `${name} should respond`);
    assert.ok(
      giflinks[name].some((link) => response.includes(link)),
      `${name} should use one configured GIF link`,
    );
  }
});

test("action, template, and GIF JSON files have matching action names", () => {
  assert.deepEqual(Object.keys(templates).sort(), Object.keys(actions).sort());
  assert.deepEqual(Object.keys(giflinks).sort(), Object.keys(actions).sort());
});

test("targeted actions require Root's structured mention", () => {
  assert.match(
    getInteractionResponse("owo hug", actorId, [], firstChoice),
    /Please mention someone/,
  );
  assert.match(
    getInteractionResponse("owo hug @not-a-root-user", actorId, [], firstChoice),
    /valid Root user/,
  );
});

test("optional and targetless actions work without a target", () => {
  assert.match(
    getInteractionResponse("owo smile", actorId, [], firstChoice),
    /https?:\/\/\S+$/,
  );
  assert.match(
    getInteractionResponse("owo happy", actorId, [], firstChoice),
    /https?:\/\/\S+$/,
  );
});

test("optional actions use their target response when mentioned", () => {
  assert.match(
    getInteractionResponse("owo smile @Rin", actorId, [mention], firstChoice),
    /Rin/,
  );
});

test("rejects multiple mentions, self-targets, and targets on targetless actions", () => {
  assert.match(
    getInteractionResponse("owo hug @Rin @Kai", actorId, [
      mention,
      { userId: "root-user-3", name: "Kai" },
    ]),
    /only one person/,
  );
  assert.match(
    getInteractionResponse("owo hug @me", actorId, [
      { userId: actorId, name: "Ner" },
    ]),
    /can't target yourself/,
  );
  assert.match(
    getInteractionResponse("owo happy @Rin", actorId, [mention]),
    /doesn't use a target/,
  );
});

test("ignores unrelated messages and unknown commands", () => {
  assert.equal(getInteractionResponse("hello", actorId, []), undefined);
  assert.equal(getInteractionResponse("owo help", actorId, []), undefined);
  assert.equal(getInteractionResponse("owow hug", actorId, []), undefined);
});

test("an action with no GIF links still sends a text response", () => {
  const saved = giflinks.happy.splice(0);
  try {
    assert.doesNotMatch(
      getInteractionResponse("owo happy", actorId, [], firstChoice),
      /giphy\.gif/,
    );
  } finally {
    giflinks.happy.push(...saved);
  }
});

test("accepts web links from other hosts and with non-GIF paths or query strings", () => {
  const original = giflinks.happy[0];
  const customLink = "https://example.com/anime/kiss?format=webp&source=custom";
  giflinks.happy[0] = customLink;

  try {
    assert.ok(
      getInteractionResponse("owo happy", actorId, [], firstChoice).includes(
        customLink,
      ),
    );
  } finally {
    giflinks.happy[0] = original;
  }
});
