import { XMLParser } from "fast-xml-parser";

export async function getFeed(baseURL: string, topic: string): Promise<Data> {

  // 15 perces frissites
  return fetch(`${baseURL}/${topic}`, { next: { revalidate: 900 } }).then((response) => {
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

        return result?.['rss']
      }
      return null;
    })
    .catch((error) => {
      console.log(error)
      return null;
    });
}