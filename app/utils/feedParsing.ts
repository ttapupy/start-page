import { FeedType } from "@/common";

function getTextValue(value: unknown) {
  if (!value || typeof value !== "object") return "";
  if ("textValue" in value && typeof value.textValue === "string") {
    return value.textValue;
  }
  return "";
}

export function getFeedTitle(parsed: Record<string, unknown>) {
  const rssTitle = getTextValue(
    (parsed as { rss?: { channel?: { title?: unknown } } })?.rss?.channel?.title,
  );
  if (rssTitle) return rssTitle;

  const atomTitle = getTextValue(
    (parsed as { feed?: { title?: unknown } })?.feed?.title,
  );
  return atomTitle;
}

export function getFeedItems(parsed: Record<string, unknown>) {
  const rssItems =
    (parsed as { rss?: { channel?: { item?: FeedItem[] } } })?.rss?.channel
      ?.item || [];
  if (Array.isArray(rssItems)) return { items: rssItems, type: FeedType.RSS };

  const atomItems =
    (parsed as { feed?: { item?: FeedItem[] } })?.feed?.item || [];
  if (Array.isArray(atomItems)) return { items: atomItems, type: FeedType.ATOM };

  return { items: [], type: null };
}

export function getItemLink(item: FeedItem, feedUrl: URL) {
  const linkValue = Array.isArray(item.link)
    ? item.link.find((link) => getTextValue(link))
    : item.link;
  const rawLink = getTextValue(linkValue);
  if (!rawLink) return null;

  try {
    return new URL(rawLink, feedUrl);
  } catch {
    return null;
  }
}
