import fsPromises from "fs/promises";
import path from "path";
import { SourceType } from "@/common";

export const sourceCookieName = "startPageSources";
export const visitedFeedCookieName = "startPageRead";
export const customFeedCookieName = "startPageCustomFeeds";

async function getStaticData(): Promise<Record<string, SourceType>> {
  const filePath = path.join(process.cwd(), "json/sources.json");
  const jsonData = await fsPromises.readFile(filePath);

  return JSON.parse(jsonData.toString());
}

function isValidSourceType(value: SourceType) {
  return (
    typeof value.baseURL === "string" &&
    typeof value.name === "string" &&
    typeof value.path === "string" &&
    typeof value.feedCategory === "string" &&
    typeof value.feedType === "string"
  );
}

export function parseCustomFeeds(
  rawCookieValue: string | undefined,
): Record<string, SourceType> {
  if (!rawCookieValue) return {};

  try {
    const parsed = JSON.parse(rawCookieValue) as Record<string, SourceType>;
    if (!parsed || typeof parsed !== "object") return {};

    return Object.fromEntries(
      Object.entries(parsed).filter(([_, value]) => {
        if (!value || typeof value !== "object") return false;
        return isValidSourceType(value);
      }),
    );
  } catch {
    return {};
  }
}

export function mergeSources(
  staticSources: Record<string, SourceType>,
  customSources: Record<string, SourceType>,
): Record<string, SourceType> {
  return { ...staticSources, ...customSources };
}

export default getStaticData;
