export enum FeedCategory {
  DEFAULT = "DEFAULT",
  TECH = "TECH",
  OUT = "OUT",
  FRONTEND = "FRONTEND",
  IT = "IT"
}

export enum FeedType {
  RSS = 'rss',
  ATOM = 'atom'
}

export interface SourceType {
  baseURL: string;
  name: string;
  path: string;
  feedCategory: FeedCategory;
  feedType: FeedType;
  image?: boolean;
  testUrl?: string;
  testUrl2?: string;
  podcast?: boolean;
}