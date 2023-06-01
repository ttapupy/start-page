export enum FeedCategory {
  DEFAULT = "DEFAULT",
  TECH = "TECH",
  OUT = "OUT",
  FRONTEND = "FRONTEND",
  IT = "IT"
}

export interface SourceType {
  baseURL: string,
  name: string;
  path: string;
  feedCategory: FeedCategory,
  feedType: 'rss' | 'atom'
  image?: boolean;
}