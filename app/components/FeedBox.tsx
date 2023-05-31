import { getFeed } from "../services/fetchFeed";
import Feed from "./Feed";
import { SourceType, FeedType } from "@/common"
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge'
import ErrorMessage from "./ErrorMessage";



export default async function FeedBox({ source }: { source: SourceType }) {
  const data = await getFeed(source.baseURL, source.path);
  const listLength = 10
  const feedList: Item[] = data?.channel?.item?.slice(0, listLength) || []
  const type = source?.feedType || FeedType.DEFAULT

  const colorTypes: Record<FeedType, string> = { [FeedType.DEFAULT]: 'border-zinc-400 text-zinc-400', [FeedType.TECH]: 'border-retro_blue text-retro_blue', [FeedType.GASTRO]: 'border-retro_red text-retro_red', [FeedType.ENGLISH]: 'border-retro_orange text-retro_orange', [FeedType.IT]: 'border-retro_green text-retro_green' }

  const spanClass = "bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-stone-900 dark:text-stone-300 border dark:border-2 border-gray-500"

  return (
    <div>
      <h4 className="mb-4" ><span className={twMerge(spanClass, clsx({ [colorTypes[type]]: true }))}>{source.name}</span></h4>
      {!!data ? <Feed feedList={feedList} type={type} /> : <ErrorMessage />}
    </div>
  )
}