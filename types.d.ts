interface RssItem {
  title: string;
  link?: string;
  pubDate?: string;
  guid?: string;
  category?: string;
  description: string;
}

interface AtomItem {
  id: string;
  title: string;
  link?: string;
  published?: string;
  category?: string;
  summary: string;
}

interface Channel {
  title: string;
  link?: string;
  description?: string;
  item: RssItem[];
}

interface Atom {
  title: string;
  subtitle: string;
  link?: string;
  updated?: string;
  entry: AtomItem[];
}

type RssData = Record<"channel", Channel> | null | undefined
type AtomData = Record<"feed", Atom> | null | undefined