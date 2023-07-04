import {getRssFeed, getAtomFeed} from "../services/fetchFeed";
import {SourceType, FeedCategory, FeedType} from "@/common"
import {clsx} from 'clsx';
import {twMerge} from 'tailwind-merge'
import ErrorMessage from "./ErrorMessage";
import FeedBox from "./FeedBox";


export default async function FeedBoxWrapper({source, sourceKey}: { source: SourceType, sourceKey: string }) {

  const listLength = 5
  const category = source?.feedCategory || FeedCategory.DEFAULT

  let feedList: FeedItem[] | null = null;

  if (source.feedType === FeedType.RSS) {
    feedList = await getRssFeed(source.baseURL, source.path);
  }
  if (source.feedType === FeedType.ATOM) {
    feedList = await getAtomFeed(source.baseURL, source.path);
  }


  if (!feedList?.length) {
    return (<ErrorMessage/>)
  }


  const colorTypes: Record<FeedCategory, string> = {
    [FeedCategory.DEFAULT]: 'border-zinc-400 text-zinc-400',
    [FeedCategory.TECH]: 'border-retro_bluer text-retro_bluer dark:border-retro_blue dark:text-retro_blue',
    [FeedCategory.OUT]: 'border-retro_red text-retro_red',
    [FeedCategory.FRONTEND]: 'border-retro_orange text-retro_orange',
    [FeedCategory.IT]: 'border-retro_greener text-retro_greener dark:border-retro_green dark:text-retro_green'
  }

  const spanClass = "bg-gray-50 dark:bg-gray-100 text-gray-800 text-xs font-medium ml-0 mr-2 px-2.5 py-0.5 rounded dark:bg-stone-900 dark:text-stone-300 border dark:border-2 border-gray-500"

  const props = {listLength, source, sourceKey, category}

  return (
      <div className="flex-[0_0_auto] min-w-[320px] max-w-[100%] pb-[5em] px-auto mr-auto">
        <h4 className="mb-4 flex justify-start">
          <span className={twMerge(spanClass, clsx({[colorTypes[category]]: true}))}>{source.name}</span>
        </h4>
        <>
          <FeedBox data={feedList} {...props} />
        </>
      </div>
  )
}