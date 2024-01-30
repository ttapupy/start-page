interface Enclosure {
  url: string;
  length: string;
  type: string;
}

interface FeedTag {
  textValue: string;
}

interface GuidTag {
  textValue: string;
  isPermaLink?: "false" | "true";
}


interface FeedItem {
  title: FeedTag;
  link: FeedTag;
  published?: FeedTag;
  summary: FeedTag;
  enclosure?: Enclosure;
  guid?: GuidTag;
}

interface Channel {
  item: FeedItem[];
}

interface Rss {
  channel: Channel;
}

interface Atom {
  item: FeedItem[];
}

type RssData = Record<"rss", Rss> | null | undefined
type AtomData = Record<"feed", Atom> | null | undefined