import { getRssFeed, getAtomFeed } from "../services/fetchFeed";
import { SourceType, FeedCategory, FeedType } from "@/common"
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge'
import ErrorMessage from "./ErrorMessage";
import FeedCard from "./FeedCard";
import { cookies } from "next/headers";
import { visitedFeedCookieName } from "@/app/api/staticdata";


export default async function FeedBoxWrapper({ source, sourceKey }: { source: SourceType, sourceKey: string }) {

  const listLength = 5
  const category = source?.feedCategory || FeedCategory.DEFAULT
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

  let feedList: FeedItem[] = []

  function filterFeedList(feedList: FeedItem[]) {
    return feedList?.filter((elem) => !elem['link'] || getText(elem?.['link'])?.match(regex)).filter(e => !e.link?.textValue || !hiddenNews.includes(e.link?.textValue)).slice(0, listLength)
  }


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


  if (source.feedType === FeedType.RSS) {
    feedList = await getRssFeed(source, sourceKey);
  }
  if (source.feedType === FeedType.ATOM) {
    feedList = await getAtomFeed(source, sourceKey);
  }

  feedList = filterFeedList(feedList)

  if (!feedList?.length) {
    return (<ErrorMessage />)
  }


  const colorTypes: Record<FeedCategory, string> = {
    [FeedCategory.DEFAULT]: 'border-zinc-400 text-zinc-400',
    [FeedCategory.TECH]: 'border-retro_bluer text-retro_bluer dark:border-retro_blue dark:text-retro_blue',
    [FeedCategory.OUT]: 'border-retro_red text-retro_red',
    [FeedCategory.FRONTEND]: 'border-retro_orange text-retro_orange',
    [FeedCategory.IT]: 'border-retro_greener text-retro_greener dark:border-retro_green dark:text-retro_green'
  }

  const spanClass = "bg-gray-50 dark:bg-gray-100 text-gray-800 text-xs font-bold ml-0 mr-2 px-2.5 py-0.5 rounded dark:bg-stone-900 dark:text-stone-300 border dark:border-2 border-gray-500"

  return (
    <div className="flex-[0_0_auto] min-w-[320px] max-w-[100%] pb-[5em] px-auto mr-auto">
      <h4 className="mb-4 flex justify-start">
        <span className={twMerge(spanClass, clsx({ [colorTypes[category]]: true }))}>{source.name}</span>
      </h4>
      <>
        {feedList?.map((item, idx) => {
          return (
            <FeedCard
              key={idx}
              sourceKey={sourceKey}
              idx={idx}
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
    </div>
  )
}