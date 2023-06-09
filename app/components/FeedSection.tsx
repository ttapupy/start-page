import { FC } from 'react';
import Image from 'next/image';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import he from 'he';
import { FeedCategory } from "@/common";



interface IFeedSectionProps {
  feedLink?: string | null;
  feedTitle: string;
  feedDescription: string;
  category: FeedCategory;
  image?: boolean;
  podcast?: string | null;
  itemKey: string;
  date?: string;
}


const FeedSection: FC<IFeedSectionProps> = ({ feedLink, feedTitle, feedDescription, category, image, podcast, itemKey, date }) => {

  const sectionClass = `bg-papirus_light dark:bg-crt_background flex flex-col max-w-[420px] justify-between items-stretch rounded-lg dark:rounded border-2 border-transparent mb-3 px-4 py-4 hover:border-blue-300 hover:bg-neutral-50 dark:hover:bg-crt_background_darker group dark:hover:text-crt_amber filter-none opacity-100 bg-opacity-100`


  const colorTypes: Record<FeedCategory, string> = { [FeedCategory.DEFAULT]: 'border-zinc-400', [FeedCategory.TECH]: 'border-retro_blue', [FeedCategory.OUT]: 'border-retro_red', [FeedCategory.FRONTEND]: 'border-retro_orange', [FeedCategory.IT]: 'border-retro_green' }

  const maxTextLength = 160


  // parse just plain text for the safety and simplicity
  const formatText = (text: string | null | undefined, title = false) => {
    if (text == null) {
      return ""
    }

    const decoded = he.decode(text.toString())
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

  const publishDate = !!date ? new Date(date) : null

  return (
    <section
      id={itemKey}
      className={twMerge(sectionClass, clsx({ [colorTypes[category]]: true }))}
    >
      {!!publishDate && <small className='font-mono text-left text-slate-600 dark:text-slate-300'>{publishDate.toISOString().substring(0, 10)}</small>}
      <a
        href={feedLink || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-3 mx-0 text-left font-semibold dark:font-500 hover:underline"

      >{formatText(feedTitle, true)}</a>

      {image ?
        <div className={`my-0 mx-0 text-justify bg-opacity-50 dark:group-hover:bg-opacity-90`}>
          {/* @ts-ignore */}
          <Image {...formatImage(feedDescription)} width="260" height="310" style={{ objectFit: "contain" }} />
        </div> :
        <div className={`my-0 mx-0 text-justify bg-opacity-50 dark:group-hover:bg-opacity-90`}>
          <div className='overflow-clip break-words'>{formatText(feedDescription)}</div>

          {!!podcast && (
            <div className='pt-4 text-center'>
              <audio controls className="mx-auto">
                <source src={podcast} type="audio/mpeg" />
                <p>Your browser does not support the audio element.</p>
              </audio>
            </div>)}
        </div>}



    </section>
  );
}

export default FeedSection;
