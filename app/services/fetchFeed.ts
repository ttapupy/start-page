import { XMLParser } from "fast-xml-parser";

export async function getFeed(baseURL: string, topic: string): Promise<Data> {

  // 15 perces frissites
  let response;
  try {
    response = await fetch(`${baseURL}/${topic}`, { next: { revalidate: 900 } });
  } catch (error) {
    console.log('error', error)
  }


  // hibas widget ne jelenjen meg
  if (!response?.ok) {
    console.log('response:', response);
    return null;
  }
  const news = await response.text()

  const parser = new XMLParser();
  let result = null;
  try {
    result = parser.parse(news, true) || null
  } catch (err) {
    console.log(err)
  }

  return result?.['rss']
}