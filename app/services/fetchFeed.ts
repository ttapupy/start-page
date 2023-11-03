import { xmlParser } from "@/app/services/xmlParser";
import { SourceType } from "@/common"

async function parseXMLResponse(response: Response) {
  if (response?.ok) {
    const news = await response.text()
    let result = null;
    try {
      result = xmlParser.parse(news, true) || null
    } catch (err) {
      console.log('parser error: ', err)
      return null;
    }
    return result;
  }
  throw new Error('cannot fetch data');
}

function getFeed<T>(baseURL: string, topic: string, sourceKey: string): Promise<T> {
  // hourly update
  return fetch(`https://${baseURL}/${encodeURI(topic)}`, { next: { revalidate: 3600, tags: [sourceKey] } })
    .then((response) => parseXMLResponse(response))
    .catch((error) => {
      console.log('network error:', error.message)
      return null;
    });
}

export async function getRssFeed(source: SourceType, sourceKey: string): Promise<FeedItem[]> {
  const rssData = await getFeed<RssData>(source.baseURL, source.path, sourceKey);

  return rssData?.['rss']?.['channel']?.['item'] || []
}

export async function getAtomFeed(source: SourceType, sourceKey: string): Promise<FeedItem[]> {
  const atomData = await getFeed<AtomData>(source.baseURL, source.path, sourceKey);

  return atomData?.['feed']?.['item'] || []
}