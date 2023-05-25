interface Item {
  title: string;
  link?: string;
  pubDate?: string;
  guid?: string;
  category?: string;
  description: string;
}

interface Channel {
  title: string;
  link?: string;
  description?: string;
  item: Item[];
}

type Data = Record<"channel", Channel> | null | undefined