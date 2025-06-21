import { xmlParser } from "@/app/services/xmlParser";
import { SourceType, FeedType } from "@/common";

export async function parseXMLResponse(response: Response) {
  if (response?.ok) {
    const news = await response.text();
    let result = null;
    try {
      result = xmlParser.parse(news, true) || null;
    } catch (error) {
      console.log("parser error: ", JSON.stringify(error));
      return null;
    }
    return result;
  }
  throw new Error("cannot fetch data");
}

export async function getFeed<T>(
  source: SourceType,
  sourceKey: string,
): Promise<FeedItem[]> {

  // hourly update
  try {
    const response = await fetch(
      `https://${source.baseURL}/${encodeURI(source.path)}`,
      { next: { revalidate: 3600, tags: [sourceKey] } },
    );

    if (source.feedType === FeedType.RSS) {
      const rssData: RssData = await parseXMLResponse(response);
      return rssData?.["rss"]?.["channel"]?.["item"] || [];
    } else if (source.feedType === FeedType.ATOM) {
      const atomData: AtomData = await parseXMLResponse(response);
      return atomData?.["feed"]?.["item"] || [];
    } else {
      return [];
    }
  } catch (error) {
    console.log("network error:", JSON.stringify(error));
    return [];
  }
}
