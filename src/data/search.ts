import { catalog, type Title } from './catalog';

/**
 * Local search over the cached catalog. Every whitespace-separated token must
 * appear in the title, metadata, or badges, so “film nos” matches Nosferatu.
 * No query leaves the device.
 */
export function searchCatalog(query: string, items: Title[] = catalog): Title[] {
  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!tokens.length) return items;

  return items.filter((item) => {
    const haystack = [
      item.title,
      item.meta,
      ...(item.badges?.map((badge) => badge.label) ?? []),
    ]
      .join(' ')
      .toLowerCase();

    return tokens.every((token) => haystack.includes(token));
  });
}

/** Suggestions shown when a search returns nothing. */
export const hotWords = ['Nosferatu', 'Metropolis', 'Frieren', 'SUB', 'DUB', 'CC'];
