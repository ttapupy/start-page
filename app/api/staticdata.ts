import fsPromises from 'fs/promises';
import path from 'path'
import {SourceType} from "@/common";

export const sourceCookieName = 'startPageSources'

async function getStaticData(): Promise<Record<string, SourceType>> {
  const filePath = path.join(process.cwd(), 'json/sources.json');
  const jsonData = await fsPromises.readFile(filePath);
  const objectData = JSON.parse(jsonData.toString());

  return objectData
}

export default getStaticData;