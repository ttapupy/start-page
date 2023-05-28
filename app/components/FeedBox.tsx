import { getFeed } from "../services/fetchFeed";
import Feed from "./Feed";
import { SourceType, FeedType } from "@/common"
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge'


export default async function FeedBox({ source }: { source: SourceType }) {
  const data = await getFeed(source.baseURL, source.path);
  const listLength = 10

  if (!data) {
    return null;
  }

  const feedList: Item[] = data?.channel?.item?.slice(0, listLength) || []
  const type = source?.feedType || FeedType.DEFAULT

  const colorTypes: Record<FeedType, string> = { [FeedType.DEFAULT]: 'border-zinc-400 text-zinc-400', [FeedType.TECH]: 'border-blue-500 text-blue-500', [FeedType.GASTRO]: 'border-red-600 text-red-600', [FeedType.ENGLISH]: 'border-amber-500 text-amber-500', [FeedType.IT]: 'border-emerald-600 text-emerald-600' }

  const spanClass = "bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-400 border border-gray-500"

  return (
    <div>
      <h4 className="mb-4" ><span className={twMerge(spanClass, clsx({ [colorTypes[type]]: true }))}>{source.name}</span></h4>
      <Feed feedList={feedList} type={type} />
    </div>
  )
}