import {xmlParser} from "@/app/services/xmlParser";

async function parseXMLResponse(response: Response) {
  if (response?.ok) {
    const news = await response.text()
    let result = null;
    try {
      result = xmlParser.parse(news, true) || null
    } catch (err) {
      console.log(err)
      return null;
    }
    return result;
  }
  return null;
}

function getFeed<T>(baseURL: string, topic: string): Promise<T> {
  // hourly update
  return fetch(`https://${baseURL}/${topic}`, {next: {revalidate: 3600}})
      .then((response) => {
        if (response.ok) {
          return parseXMLResponse(response);
        }
        return null;
      })
      .catch((error) => {
        console.log(error)
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