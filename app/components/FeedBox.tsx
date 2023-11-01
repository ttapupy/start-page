import { SourceType, FeedCategory } from "@/common"
import FeedCard from "./FeedCard";
import { cookies } from "next/headers";
import { visitedFeedCookieName } from "@/app/api/staticdata";


interface FeedBoxProps {
  listLength: number;
  source: SourceType;
  sourceKey: string;
  category: FeedCategory;
  data: FeedItem[]
}


export default function FeedBox({ listLength, source, sourceKey, category, data }: FeedBoxProps) {
  let hiddenNews: string[] = [];
  const getText = (prop: FeedTag | undefined) => (prop?.['textValue'] || '');
  const cookieStore = cookies()
  const visitedCookie = cookieStore.get(`${visitedFeedCookieName}${sourceKey}`)?.value
  const expDays = 4
  if (visitedCookie && Array.isArray(JSON.parse(visitedCookie))) {
    hiddenNews = JSON.parse(visitedCookie) as string[]
  }

  // disallowing suspicious links and also filtering out hidden (by user) news
  let regex = new RegExp(`^https?:\/\/(www\.)?${source.testUrl || source.testUrl2 || source.baseURL}.+$`)
  const feedList = data?.filter((elem) => !elem['link'] || getText(elem?.['link'])?.match(regex)).filter(e => !e.link?.textValue || !hiddenNews.includes(e.link?.textValue)).slice(0, listLength)


  async function handleHide(link: string) {
    "use server";

    const today = new Date();
    let expirationDate = new Date();
    // After some days we reset this cookie
    expirationDate.setDate(today.getDate() + expDays);
    // @ts-ignore
    cookies().set(`${visitedFeedCookieName}${sourceKey}`, JSON.stringify([...hiddenNews, link]),
      {
        sameSite: 'strict',
        secure: true,
        httpOnly: true,
        overwrite: true,
        expires: expirationDate
      })
  }

  return (
    <>
      {feedList?.map((item, idx) => {
        return (
          <FeedCard
            key={idx}
            itemKey={`${sourceKey}_${idx}`}
            feedLink={getText(item?.['link'])}
            category={category}
            feedTitle={getText(item?.['title'])}
            feedDescription={getText(item?.['summary'])}
            image={source.image || false}
            podcast={source.podcast ? item?.['enclosure']?.['url'] || null : null}
            date={getText(item['published'])}
            handleHide={handleHide}
          />
        )
      })}
    </>
  )
};