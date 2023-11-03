"use client"

import * as React from 'react';
import Image from 'next/image';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import he from 'he';
import { FeedCategory } from "@/common";
import PodcastPlayer from "@/app/components/PodcastPlayer";
import CardHeader from "@/app/components/CardHeader";


interface IFeedCardProps {
  feedLink: string;
  feedTitle: string;
  feedDescription: string;
  category: FeedCategory;
  image?: boolean;
  podcast?: string | null;
  sourceKey: string;
  idx: number;
  date?: string;
  handleHide: (link: string) => any;
}


const FeedCard: React.FC<IFeedCardProps> = ({
  feedLink,
  feedTitle,
  feedDescription,
  category,
  image,
  podcast,
  sourceKey,
  idx,
  date,
  handleHide
}) => {

  const sectionClass = `bg-papirus_light dark:bg-crt_background flex flex-col max-w-[420px] justify-between items-stretch rounded-lg dark:rounded border-2 border-transparent mb-3 px-4 py-4 hover:border-blue-300 hover:bg-neutral-50 dark:hover:bg-crt_background_darker group dark:hover:text-crt_amber filter-none opacity-100 bg-opacity-100`
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
    if (delay.current) {
      return () => {
        window.clearTimeout(delay.current);
      }
    }
  }, [])

  const hideFeed = async () => {
    setHidden(true)
    await handleHide(feedLink)
    delay.current = window.setTimeout(() => setHidden(false), 1000)
  }


  return (
    <section
      id={itemKey}
      className={twMerge(sectionClass,
        clsx({
          [colorTypes[category]]: true,
          'opacity-0 [transition:ease-out_0s,_opacity_500ms_ease-out__0s]': hidden
        }))}
    >
      <CardHeader date={publishDate} handleClose={hideFeed} />
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
