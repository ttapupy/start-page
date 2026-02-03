import { FeedCategory, SourceType } from "@/common";
import { parseXMLResponse } from "@/app/services/fetchFeed";
import { isIP } from "node:net";
import {
  getFeedItems,
  getFeedTitle,
  getItemLink,
} from "@/app/utils/feedParsing";

const blockedHostnames = new Set(["localhost"]);

function isPrivateIpv4(hostname: string) {
  const parts = hostname.split(".").map((part) => Number(part));
  if (parts.length !== 4 || parts.some((part) => Number.isNaN(part))) {
    return false;
  }

  const [first, second] = parts;
  if (first === 10) return true;
  if (first === 127) return true;
  if (first === 169 && second === 254) return true;
  if (first === 172 && second >= 16 && second <= 31) return true;
  if (first === 192 && second === 168) return true;
  if (first === 0) return true;

  return false;
}

function isPrivateIpv6(hostname: string) {
  const normalized = hostname.toLowerCase();
  return (
    normalized === "::1" ||
    normalized.startsWith("fc") ||
    normalized.startsWith("fd") ||
    normalized.startsWith("fe80")
  );
}

export function isPublicHostname(hostname: string) {
  if (blockedHostnames.has(hostname)) return false;
  if (hostname.endsWith(".local")) return false;

  const ipVersion = isIP(hostname);
  if (ipVersion === 4) {
    return !isPrivateIpv4(hostname);
  }
  if (ipVersion === 6) {
    return !isPrivateIpv6(hostname);
  }

  return true;
}


function buildCustomFeedKey(
  baseURL: string,
  path: string,
  existing: Set<string>,
) {
  const baseKey = `${baseURL}_${path || "root"}`
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
  if (!existing.has(baseKey)) return baseKey;

  let counter = 2;
  let nextKey = `${baseKey}_${counter}`;
  while (existing.has(nextKey)) {
    counter += 1;
    nextKey = `${baseKey}_${counter}`;
  }
  return nextKey;
}

export type AddCustomFeedResult =
  | { ok: true; feedKey: string; source: SourceType }
  | { ok: false; error: string };

export async function validateCustomFeedUrl(
  rawUrl: string,
): Promise<
  | { ok: true; feedUrl: URL; source: SourceType }
  | { ok: false; error: string }
> {
  const trimmedUrl = rawUrl.trim();
  if (!trimmedUrl) {
    return { ok: false, error: "Please enter a feed URL." };
  }

  let feedUrl: URL;
  try {
    feedUrl = new URL(trimmedUrl);
  } catch {
    return { ok: false, error: "Invalid URL format." };
  }

  if (feedUrl.protocol !== "https:") {
    return { ok: false, error: "Only https URLs are allowed." };
  }

  if (feedUrl.username || feedUrl.password) {
    return { ok: false, error: "Credentials in the URL are not allowed." };
  }

  if (!isPublicHostname(feedUrl.hostname)) {
    return { ok: false, error: "This host is not allowed." };
  }

  const response = await fetch(feedUrl.toString(), { cache: "no-store" });
  const parsed = await parseXMLResponse(response);
  if (!parsed) {
    return { ok: false, error: "Could not read a valid RSS or Atom feed." };
  }

  const { items, type } = getFeedItems(parsed as Record<string, unknown>);
  if (!type) {
    return { ok: false, error: "Unsupported feed format." };
  }

  const sampleItems = items.slice(0, 5);
  for (const item of sampleItems) {
    const itemUrl = getItemLink(item, feedUrl);
    if (!itemUrl) continue;
    const host = itemUrl.hostname;
    if (host !== feedUrl.hostname && host !== `www.${feedUrl.hostname}`) {
      return { ok: false, error: "Feed item links do not match the host." };
    }
  }

  const normalizedPath = `${feedUrl.pathname}${feedUrl.search}`.replace(
    /^\/+/,
    "",
  );
  const name = getFeedTitle(parsed as Record<string, unknown>) || feedUrl.hostname;
  const source: SourceType = {
    baseURL: feedUrl.hostname,
    name,
    path: normalizedPath,
    feedCategory: FeedCategory.DEFAULT,
    feedType: type,
    testUrl: feedUrl.hostname,
  };

  return {
    ok: true,
    feedUrl,
    source,
  };
}

export function resolveCustomFeedKey(
  source: SourceType,
  existing: Record<string, SourceType>,
) {
  return buildCustomFeedKey(source.baseURL, source.path, new Set(Object.keys(existing)));
}
