import { FC } from 'react';
import Image from 'next/image';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import he from 'he';
import { FeedCategory } from "@/common";


interface IFeedSectionProps {
  feedLink?: string;
  feedTitle: string;
  feedDescription: string;
  category: FeedCategory;
  image?: boolean;
}


const FeedSection: FC<IFeedSectionProps> = ({ feedLink, feedTitle, feedDescription, category, image }) => {
  const sectionClass = `flex flex-col max-w-[36ch] justify-between items-stretch rounded-lg dark:rounded border-2 dark:border-4 border-transparent px-5 py-4 hover:border-blue-300 hover:bg-stone-100 dark:hover:bg-crt_background_darker group dark:hover:text-crt_amber`

  const colorTypes: Record<FeedCategory, string> = { [FeedCategory.DEFAULT]: 'hover:border-zinc-400', [FeedCategory.TECH]: 'hover:border-retro_blue', [FeedCategory.OUT]: 'hover:border-retro_red', [FeedCategory.FRONTEND]: 'hover:border-retro_orange', [FeedCategory.IT]: 'hover:border-retro_green' }

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


  const formatImage = (text: string | null | undefined) => {
    let src = null
    let alt = ""
    if (text == null) {
      return { src, alt }
    }

    src = text.match(/src=\"([\w\\\/\:\.]+)\"/)?.[1] || null
    alt = text.match(/alt=\"([\w\\\/\:\.,\s\']+)\"/)?.[1] || ""

    return { src, alt }
  }

  return (
    <section
      className={twMerge(sectionClass, clsx({ [colorTypes[category]]: true }))}
    >
      <a
        href={`${feedLink || '#'}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-3 mx-0 text-left font-semibold dark:font-500 hover:underline max-w-[30ch]"

      >{formatText(feedTitle, true)}</a>

      {image ?
        <div className={`my-0 mx-0 max-w-[30ch] text-justify bg-opacity-50 dark:group-hover:bg-opacity-90`}>
          {/* @ts-ignore */}
          <Image {...formatImage(feedDescription)} width="260" height="310" style={{ objectFit: "contain" }} />
        </div> :
        <div className={`my-0 mx-0 max-w-[30ch] text-justify bg-opacity-50 dark:group-hover:bg-opacity-90`}>{formatText(feedDescription)}</div>}

    </section>
  );
}

export default FeedSection;
