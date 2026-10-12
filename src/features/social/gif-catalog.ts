import gifCatalogData from "./gif-catalog.json";
import { SocialActionId, socialActions } from "./action-definitions";

export type GifCatalog = Readonly<
  Record<SocialActionId, readonly string[]>
>;

const directGifUrlPattern =
  /^https:\/\/media\.giphy\.com\/media\/[A-Za-z0-9_-]+\/giphy\.gif$/;

export function loadGifCatalog(value: unknown): GifCatalog {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error("The social GIF catalog must be a JSON object.");
  }

  const data = value as Record<string, unknown>;
  const catalog = {} as Record<SocialActionId, readonly string[]>;

  for (const actionId of Object.keys(socialActions) as SocialActionId[]) {
    const entries = data[actionId];
    if (!Array.isArray(entries)) {
      throw new Error(`The GIF catalog entry "${actionId}" must be an array.`);
    }

    const urls: string[] = [];
    for (const entry of entries as unknown[]) {
      if (typeof entry !== "string" || !directGifUrlPattern.test(entry)) {
        throw new Error(
          `The GIF catalog entry "${actionId}" contains a non-direct Giphy GIF URL.`,
        );
      }
      urls.push(entry);
    }

    catalog[actionId] = urls;
  }

  const unexpectedAction = Object.keys(data).find(
    (key) => !Object.prototype.hasOwnProperty.call(socialActions, key),
  );
  if (unexpectedAction) {
    throw new Error(`Unknown social GIF catalog entry "${unexpectedAction}".`);
  }

  return catalog;
}

export const gifCatalog = loadGifCatalog(gifCatalogData);

export function selectRandomGif(
  actionId: SocialActionId,
  catalog: GifCatalog = gifCatalog,
  random: () => number = Math.random,
): string | undefined {
  const entries = catalog[actionId];
  if (entries.length === 0) {
    return undefined;
  }

  const value = random();
  if (!Number.isFinite(value) || value < 0 || value >= 1) {
    throw new RangeError("The random source must return a number in [0, 1).");
  }

  return entries[Math.floor(value * entries.length)];
}

export function getGifCatalogStats(): {
  readonly total: number;
  readonly byAction: Readonly<Record<SocialActionId, number>>;
} {
  const byAction = {} as Record<SocialActionId, number>;

  for (const actionId of Object.keys(socialActions) as SocialActionId[]) {
    byAction[actionId] = gifCatalog[actionId].length;
  }

  return {
    total: Object.values(byAction).reduce((sum, count) => sum + count, 0),
    byAction,
  };
}
