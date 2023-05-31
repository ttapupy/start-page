import { getRssFeed, getAtomFeed } from "../services/fetchFeed";
import Feed from "./Feed";
import { SourceType, FeedCategory } from "@/common"
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge'
import ErrorMessage from "./ErrorMessage";



export default async function FeedBox({ source }: { source: SourceType }) {
  let rssData = null
  let atomData = null
  let rssList = null
  let atomList = null
  const listLength = 5

  if (source.feedType === 'rss') {
    rssData = await getRssFeed(source.baseURL, source.path);
    rssList = rssData?.['channel']?.item?.slice(0, listLength) || []
  }

  if (source.feedType === 'atom') {
    atomData = await getAtomFeed(source.baseURL, source.path);
    atomList = atomData?.['feed']?.entry?.slice(0, listLength) || []
  }


  const category = source?.feedCategory || FeedCategory.DEFAULT

  const colorTypes: Record<FeedCategory, string> = { [FeedCategory.DEFAULT]: 'border-zinc-400 text-zinc-400', [FeedCategory.TECH]: 'border-retro_bluer text-retro_bluer dark:border-retro_blue dark:text-retro_blue', [FeedCategory.GASTRO]: 'border-retro_red text-retro_red', [FeedCategory.FRONTEND]: 'border-retro_orange text-retro_orange', [FeedCategory.IT]: 'border-retro_greener text-retro_greener dark:border-retro_green dark:text-retro_green' }

  const spanClass = "bg-gray-50 dark:bg-gray-100 text-gray-800 text-xs font-medium ml-0 mr-2 px-2.5 py-0.5 rounded dark:bg-stone-900 dark:text-stone-300 border dark:border-2 border-gray-500"

  return (
    <div className="flex-[0_0_auto] min-w-[20ch] mx-1 pb-[5em]">
      <h4 className="mb-4 flex justify-start" ><span className={twMerge(spanClass, clsx({ [colorTypes[category]]: true }))}>{source.name}</span></h4>
      {!!rssList ?
        <Feed rssList={rssList} category={category} /> :
        (atomList ? <Feed atomList={atomList} category={category} /> : <ErrorMessage />)}
    </div>
  )
}