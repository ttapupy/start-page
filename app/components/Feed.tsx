import { FC } from 'react';
import { FeedCategory } from "@/common"
import he from 'he'
import FeedSection from './FeedSection';

interface FeedProps {
  category: FeedCategory;
}

type ConditionalFeedProps =
  | {
    rssList?: RssItem[];
    atomList?: never;
  }
  | {
    rssList?: never;
    atomList?: AtomItem[];
  };

type FeedIProps = FeedProps & ConditionalFeedProps


const Feed: FC<FeedIProps> = ({ category, rssList, atomList }) => {
  const maxTextLength = 140

  const formatText = (text: string | null | undefined, title = false) => {
    if (text == null) {
      return ""
    }
    const decoded = he.decode(text)
    if (decoded == null) {
      return ""
    }
    if (title) {
      return decoded.substring(0, maxTextLength)
    }
    let description = decoded.replace(/(\<.+?(?=[\>\/])\/?\>)|(\\n)/g, "").substring(0, maxTextLength)
    return description?.length > maxTextLength - 3 ? `${description.replace(/,?\s+\S*$/, "")}...` : description
  }




  return (
    <>
      {rssList && rssList?.map((item, idx) => {
        return (
          <FeedSection key={idx} feedLink={item.link} category={category} feedTitle={item.title} feedDescription={item.description} formatText={formatText} />
        )
      })}

      {atomList && atomList?.map((item, idx) => {
        return (
          <FeedSection key={idx} feedLink={item.id} category={category} feedTitle={item.title} feedDescription={item.summary} formatText={formatText} />
        )
      })}
    </>
  )
}

export default Feed;