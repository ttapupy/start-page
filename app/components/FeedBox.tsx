import { SourceType, FeedCategory, FeedType } from "@/common"
import FeedSection from "./FeedSection";


interface FeedBoxProps {
  listLength: number;
  source: SourceType;
  sourceKey: string;
  category: FeedCategory;
  data: FeedItem[]
}


export default function FeedBox({ listLength, source, sourceKey, category, data }: FeedBoxProps) {

  const getText = (prop: FeedTag | undefined) => (prop?.['textValue'] || '');

  // disallow suspicious links
  let regex = new RegExp(`^https?:\/\/${source.testUrl || source.testUrl2 || source.baseURL}.+$`)
  const feedList = data.slice(0, listLength)?.filter((elem) => !elem['link'] || getText(elem?.['link'])?.match(regex))


  return (
    <>
      {feedList?.map((item, idx) => {
        return (
          <FeedSection itemKey={`${sourceKey}_${idx}`} key={idx} feedLink={item['link'] ? getText(item?.['link']) : (source.testUrl ? `https://${source.testUrl}` : null)} category={category} feedTitle={getText(item?.['title'])} feedDescription={getText(item?.['summary'])} image={source.image || false} podcast={source.podcast ? item?.['enclosure']?.['url'] || null : null} date={getText(item['published'])} />
        )
      })}
    </>
  )
};