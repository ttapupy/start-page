import fsPromises from "fs/promises";
import path from "path";
import { SourceType } from "@/common";

export const sourceCookieName = "startPageSources";
export const visitedFeedCookieName = "startPageRead";

async function getStaticData(): Promise<Record<string, SourceType>> {
  const filePath = path.join(process.cwd(), "json/sources.json");
  const jsonData = await fsPromises.readFile(filePath);

  return JSON.parse(jsonData.toString());
}

export default getStaticData;
