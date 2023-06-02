import { SourceType, FeedCategory, FeedType } from "@/common"
import FeedSection from "./FeedSection";

type BoxProps<T extends AtomItem | RssItem> =
  {
    linkProp: keyof T,
    contentProp: keyof T,
    data: T[]
  }

interface Commonprops {
  listLength: number;
  source: SourceType;
  sourceKey: string;
  category: FeedCategory;
}

type FeedBoxProps<T extends AtomItem | RssItem> = Commonprops & BoxProps<T>

export default function FeedBox<T extends AtomItem | RssItem>({ listLength, source, sourceKey, category, linkProp, contentProp, data }: FeedBoxProps<T>) {

  const feedList = data.slice(0, listLength)?.filter((elem) => elem[linkProp]?.toString()?.startsWith(`https://${source.baseURL}`))


  return (
    <>
      {feedList?.map((item, idx) => {
        return (
          <FeedSection itemKey={`${sourceKey}_${idx}`} key={idx} feedLink={item.link} category={category} feedTitle={item.title} feedDescription={item[contentProp]?.toString() || ''} image={source.image || false} />
        )
      })}
    </>
  )
};