export enum FeedType {
  DEFAULT = "DEFAULT",
  TECH = "TECH",
  GASTRO = "GASTRO",
  ENGLISH = "ENGLISH",
  IT = "IT"
}

export interface SourceType {
  baseURL: string,
  name: string;
  path: string;
  feedType: FeedType
}