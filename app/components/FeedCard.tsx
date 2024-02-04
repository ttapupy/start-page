"use client"

import * as React from 'react';
import Image from 'next/image';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import he from 'he';
import { FeedCategory } from "@/common";
import PodcastPlayer from "@/app/components/PodcastPlayer";
import CardHeader from "@/app/components/CardHeader";
import { handleHide } from '../lib/actions';


interface IFeedCardProps {
  feedLink: string;
  feedTitle: string;
  feedDescription: string;
  guid?: string;
  category: FeedCategory;
  image?: boolean;
  podcast?: string | null;
  sourceKey: string;
  idx: number;
  date?: string;
}


const FeedCard: React.FC<IFeedCardProps> = ({
  feedLink,
  feedTitle,
  feedDescription,
  guid,
  category,
  image,
  podcast,
  sourceKey,
  idx,
  date
}) => {

  const sectionClass = `relative top-0 right-0 hover:-left-px hover:top-[-3px] shadow-[2px_2px_rgba(0,0,0,0.4)] hover:shadow-[3px_6px_rgba(0,0,0,0.4)] [transition:top_300ms_ease-in-out] [transition:left_300ms_ease-in-out] bg-papirus_light dark:bg-crt_background flex flex-col max-w-[420px] justify-between items-stretch rounded-lg dark:rounded border-2 border-transparent mb-3 px-4 py-4 hover:border-blue-300 hover:bg-neutral-50 dark:hover:bg-crt_background_darker group opacity-100 dark:hover:text-crt_amber hover:bg-opacity-90 dark:hover:bg-opacity-90 bg-opacity-60 dark:bg-opacity-60 backdrop-filter backdrop-blur-lg`

  const colorTypes: Record<FeedCategory, string> = {
    [FeedCategory.DEFAULT]: 'border-zinc-400',
    [FeedCategory.TECH]: 'border-retro_blue',
    [FeedCategory.OUT]: 'border-retro_red',
    [FeedCategory.FRONTEND]: 'border-retro_orange',
    [FeedCategory.IT]: 'border-retro_green'
  }
  const maxTextLength = 160
  const [hidden, setHidden] = React.useState(false)
  const delay = React.useRef<number | undefined>()
  const itemKey = `${sourceKey}_${idx}`
  const expDays = 4
  const guidOrLink = guid ?? feedLink

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
    let src = ""
    let alt = ""
    if (text == null || text == "") {
      return { src, alt }
    }
    src = text.match(/src=\"([\w\\\/\:\.]+)\"/)?.[1] || ""
    alt = text.match(/alt=\"([\w\\\/\:\.,\s\']+)\"/)?.[1] || ""

    return { src, alt }
  }

  const publishDate = !!date ? new Date(date) : null



  React.useEffect(() => {
    if (hidden) {

      delay.current = window.setTimeout(() => handleHide(guidOrLink, sourceKey, expDays), 800)
    }

    return () => {
      if (hidden) {
        setHidden(false);
        window.clearTimeout(delay.current);
      }
    }
  }, [guidOrLink, hidden, sourceKey])


  return (
    <section
      id={itemKey}
      className={twMerge(sectionClass,
        clsx({
          [colorTypes[category]]: true,
          'opacity-0 [transition:ease-out_0s,_opacity_1000ms_ease-out__0s]': hidden
        }))}
    >
      <CardHeader date={publishDate} handleClose={() => setHidden(true)} />
      <a
        href={feedLink || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-3 mx-0 text-left font-semibold dark:font-500 hover:underline"
      >
        {formatText(feedTitle, true)}
      </a>

      {image
        ? <div
          className={`my-0 mx-0 text-justify bg-opacity-50 dark:group-hover:bg-opacity-90`}
          data-testid="image-container"
        >
          {/* @ts-ignore */}
          <Image {...formatImage(feedDescription)} width="260" height="310" style={{ objectFit: "contain" }} />
        </div>
        : <div className={`my-0 mx-0 text-justify bg-opacity-50 dark:group-hover:bg-opacity-90`}>
          <div className='overflow-clip break-words'>{formatText(feedDescription)}</div>
          {!!podcast && <PodcastPlayer podcast={podcast} itemKey={itemKey} />}
        </div>
      }
    </section>
  );
}

export default FeedCard;
