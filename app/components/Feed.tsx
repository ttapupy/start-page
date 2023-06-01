import { FC } from 'react';
import { FeedCategory } from "@/common"
import FeedSection from './FeedSection';

interface FeedProps {
  category: FeedCategory;
  image: boolean;
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


const Feed: FC<FeedIProps> = ({ category, image, rssList, atomList }) => {

  return (
    <>
      {rssList && rssList?.map((item, idx) => {
        return (
          <FeedSection key={idx} feedLink={item.link} category={category} feedTitle={item.title} feedDescription={item.description} image={image} />
        )
      })}

      {atomList && atomList?.map((item, idx) => {
        return (
          <FeedSection key={idx} image={image} feedLink={item.id} category={category} feedTitle={item.title} feedDescription={item.summary} />
        )
      })}
    </>
  )
}

export default Feed;