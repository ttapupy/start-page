import {xmlParser} from "@/app/services/xmlParser";

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

function getFeed<T>(baseURL: string, topic: string): Promise<T> {
  // hourly update
  return fetch(`https://${baseURL}/${topic}`, {next: {revalidate: 3600}})
      .then((response) => parseXMLResponse(response))
      .catch((error) => {
        console.log('network error:', error.message)
        return null;
      });
}

export async function getRssFeed(baseURL: string, topic: string): Promise<FeedItem[]> {
  const rssData = await getFeed<RssData>(baseURL, topic);

  return rssData?.['rss']?.['channel']?.['item'] || []
}

export async function getAtomFeed(baseURL: string, topic: string): Promise<FeedItem[]> {
  const atomData = await getFeed<AtomData>(baseURL, topic);

  return atomData?.['feed']?.['item'] || []
}