const assert = require("node:assert/strict");
const test = require("node:test");

const { socialActions } = require("../../../dist/features/social/action-definitions.js");
const {
  getGifCatalogStats,
  gifCatalog,
  loadGifCatalog,
  selectRandomGif,
} = require("../../../dist/features/social/gif-catalog.js");
const {
  executeSocialCommand,
  parseSocialCommand,
} = require("../../../dist/features/social/interactions.js");

const target = { userId: "root-user-2", name: "Rin" };
const context = { actorUserId: "root-user-1", targets: [target] };
const firstChoice = () => 0;

test("parses every registered action and ignores unrelated messages", () => {
  for (const actionId of Object.keys(socialActions)) {
    assert.deepEqual(parseSocialCommand(`owo ${actionId}`), {
      actionId,
      hasArguments: false,
    });
  }

  assert.deepEqual(parseSocialCommand("OWO HUG @Rin"), {
    actionId: "hug",
    hasArguments: true,
  });
  assert.equal(parseSocialCommand("hello"), undefined);
  assert.equal(parseSocialCommand("owo help"), undefined);
  assert.equal(parseSocialCommand("owow hug"), undefined);
});

test("requires one structured Root user mention for targeted actions", () => {
  const command = parseSocialCommand("owo hug");
  assert.ok(command);

  const result = executeSocialCommand(command, {
    actorUserId: "root-user-1",
    targets: [],
  });
  assert.equal(result.kind, "reply");
  assert.match(result.content, /owo hug @someone/);
});

test("does not treat plain @text as a validated user mention", () => {
  const command = parseSocialCommand("owo hug @not-a-root-user");
  assert.ok(command);

  const result = executeSocialCommand(command, {
    actorUserId: "root-user-1",
    targets: [],
  });
  assert.equal(result.kind, "reply");
  assert.match(result.content, /valid Root user/);
});

test("uses the structured mention name and adds a direct GIF URL", () => {
  const command = parseSocialCommand("owo hug @Rin");
  assert.ok(command);

  const result = executeSocialCommand(command, context, firstChoice);
  assert.equal(result.kind, "reply");
  assert.match(result.content, /Rin/);
  assert.match(
    result.content,
    /https:\/\/media\.giphy\.com\/media\/[A-Za-z0-9_-]+\/giphy\.gif$/,
  );
});

test("rejects multiple targets and self-targeting", () => {
  const command = parseSocialCommand("owo punch @Rin");
  assert.ok(command);

  const multipleTargets = executeSocialCommand(command, {
    actorUserId: "root-user-1",
    targets: [target, { userId: "root-user-3", name: "Kai" }],
  });
  assert.equal(multipleTargets.kind, "reply");
  assert.match(multipleTargets.content, /only one person/);

  const selfTarget = executeSocialCommand(command, {
    actorUserId: "root-user-1",
    targets: [{ userId: "root-user-1", name: "Ner" }],
  });
  assert.equal(selfTarget.kind, "reply");
  assert.match(selfTarget.content, /can't target yourself/);
});

test("optional targets work, while targetless actions reject arguments", () => {
  const look = parseSocialCommand("owo look @Rin");
  assert.ok(look);
  const lookResult = executeSocialCommand(look, context, firstChoice);
  assert.equal(lookResult.kind, "reply");
  assert.match(lookResult.content, /Rin/);
  assert.match(lookResult.content, /giphy\.gif$/);

  const happy = parseSocialCommand("owo happy");
  assert.ok(happy);
  const happyResult = executeSocialCommand(
    happy,
    { actorUserId: "root-user-1", targets: [] },
    firstChoice,
  );
  assert.equal(happyResult.kind, "reply");
  assert.match(happyResult.content, /giphy\.gif$/);

  const unexpectedTarget = parseSocialCommand("owo happy @Rin");
  assert.ok(unexpectedTarget);
  const targetError = executeSocialCommand(unexpectedTarget, context);
  assert.equal(targetError.kind, "reply");
  assert.match(targetError.content, /does not use a target/);
});

test("catalog includes direct GIF URLs for every action and reports its size", () => {
  const actionIds = Object.keys(socialActions);
  assert.deepEqual(Object.keys(gifCatalog).sort(), actionIds.sort());

  for (const entries of Object.values(gifCatalog)) {
    assert.ok(entries.length >= 1);
    for (const url of entries) {
      assert.match(
        url,
        /^https:\/\/media\.giphy\.com\/media\/[A-Za-z0-9_-]+\/giphy\.gif$/,
      );
    }
  }

  const stats = getGifCatalogStats();
  assert.equal(
    stats.total,
    Object.values(stats.byAction).reduce((sum, count) => sum + count, 0),
  );
  assert.equal(stats.total, 54);
});

test("empty catalogs fall back cleanly and malformed catalog URLs are rejected", () => {
  const emptyHugCatalog = { ...gifCatalog, hug: [] };
  assert.equal(selectRandomGif("hug", emptyHugCatalog, firstChoice), undefined);

  const happy = parseSocialCommand("owo happy");
  assert.ok(happy);
  const textOnlyFallback = executeSocialCommand(
    happy,
    { actorUserId: "root-user-1", targets: [] },
    firstChoice,
    { ...gifCatalog, happy: [] },
  );
  assert.equal(textOnlyFallback.kind, "reply");
  assert.doesNotMatch(textOnlyFallback.content, /giphy\.gif/);

  const invalidCatalog = {
    ...gifCatalog,
    hug: ["https://giphy.com/search/hug"],
  };
  assert.throws(() => loadGifCatalog(invalidCatalog), /non-direct Giphy GIF URL/);

  assert.throws(
    () => selectRandomGif("smile", gifCatalog, () => 1),
    /random source/,
  );
});
