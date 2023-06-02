import { XMLParser } from "fast-xml-parser";



async function getFeed<T>(baseURL: string, topic: string, type: 'rss' | 'atom'): Promise<T> {

  // orankenti frissites
  return fetch(`http://${baseURL}/${topic}`, { next: { revalidate: 3600 } }).then((response) => {
    if (response.ok) {
      return response;
    }
    return null;
  })
    .then(async (response) => {
      if (response?.ok) {
        const news = await response.text()

        const parser = new XMLParser();
        let result = null;
        try {
          result = parser.parse(news, true) || null
        } catch (err) {
          console.log(err)
          return null;
        }

        return type === 'rss' ? result?.[type] : result
      }
      return null;
    })
    .catch((error) => {
      console.log(error)
      return null;
    });
}

export async function getRssFeed(baseURL: string, topic: string): Promise<RssItem[]> {
  const rssData = await getFeed<RssData>(baseURL, topic, 'rss');
  return rssData?.['channel']?.item || []
}

export async function getAtomFeed(baseURL: string, topic: string): Promise<AtomItem[]> {
  const atomData = await getFeed<AtomData>(baseURL, topic, 'atom');
  return atomData?.['feed']?.entry || []
}