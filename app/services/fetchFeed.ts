import { XMLParser } from "fast-xml-parser";



async function getFeed<T>(baseURL: string, topic: string): Promise<T> {

  // hourly update
  return fetch(`https://${baseURL}/${topic}`, { next: { revalidate: 3600 } }).then((response) => {
    if (response.ok) {
      return response;
    }
    return null;
  })
    .then(async (response) => {
      if (response?.ok) {
        const news = await response.text()

        const parser = new XMLParser(
          {
            ignoreAttributes: false,
            attributeNamePrefix: "",
            allowBooleanAttributes: true,
            htmlEntities: true,
            alwaysCreateTextNode: true,
            textNodeName: "textValue",
            transformAttributeName: (attributeName) => {
              if (attributeName === 'href') return 'textValue';
              return attributeName;
            },
            transformTagName: (tagName) => {
              if (tagName === 'description') return 'summary';
              if (tagName === 'pubDate') return 'published';
              if (tagName === 'entry') return 'item';
              return tagName;
            }
          })
        let result = null;
        try {
          result = parser.parse(news, true) || null
        } catch (err) {
          console.log(err)
          return null;
        }

        return result
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