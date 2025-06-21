import { getFeed } from "../services/fetchFeed";
import { SourceType, FeedCategory } from "@/common";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import ErrorMessage from "./ErrorMessage";
import FeedCard from "./FeedCard";
import { getVisitedNews } from "../lib/actions";
import { filterFeedList, getText } from "../utils/feedBoxUtils";

export default async function FeedBoxColumn({
  source,
  sourceKey,
}: {
  source: SourceType;
  sourceKey: string;
}) {
  const listLength = 5;
  const category = source?.feedCategory || FeedCategory.DEFAULT;
  const hiddenNews = (await getVisitedNews(sourceKey)) as string[];

  let feedList: FeedItem[];

  feedList = await getFeed(source, sourceKey);

  feedList = filterFeedList(feedList, source, hiddenNews, listLength);

  const colorTypes: Record<FeedCategory, string> = {
    [FeedCategory.DEFAULT]: "border-zinc-400 text-zinc-400",
    [FeedCategory.TECH]:
      "border-retro_bluer text-retro_bluer dark:border-retro_blue dark:text-retro_blue",
    [FeedCategory.OUT]: "border-retro_red text-retro_red",
    [FeedCategory.FRONTEND]: "border-retro_orange text-retro_orange",
    [FeedCategory.IT]:
      "border-retro_greener text-retro_greener dark:border-retro_green dark:text-retro_green",
  };

  const spanClass =
    "bg-gray-50 dark:bg-gray-100 text-gray-800 text-xs font-bold ml-0 mr-2 px-2.5 pt-0.5 pb-1 rounded dark:bg-stone-900 dark:text-stone-300 border dark:border-2 border-gray-500";

  return (
    <div className="px-auto mr-auto min-w-[320px] max-w-[100%] flex-[0_0_auto] pb-[5em]">
      <h4 className="mb-4 flex justify-start">
        <span
          className={twMerge(spanClass, clsx({ [colorTypes[category]]: true }))}
        >
          {source.name}
        </span>
      </h4>
      <>
        {!!feedList?.length ? (
          feedList?.map((item, idx) => {
            return (
              <FeedCard
                key={idx}
                sourceKey={sourceKey}
                idx={idx}
                feedLink={getText(item?.["link"])}
                guid={getText(item?.["guid"])}
                category={category}
                feedTitle={getText(item?.["title"])}
                feedDescription={getText(item?.["summary"])}
                image={source.image || false}
                podcast={
                  source.podcast ? item?.["enclosure"]?.["url"] || null : null
                }
                date={getText(item["published"])}
              />
            );
          })
        ) : (
          <ErrorMessage />
        )}
      </>
    </div>
  );
}
