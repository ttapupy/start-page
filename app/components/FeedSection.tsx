import { FC } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge'
import { FeedCategory } from "@/common"


interface IFeedSectionProps {
  feedLink?: string;
  feedTitle: string;
  feedDescription: string;
  formatText(text: string | null | undefined, title?: boolean): string;
  category: FeedCategory;
}


const FeedSection: FC<IFeedSectionProps> = ({ feedLink, feedTitle, feedDescription, formatText, category }) => {
  const sectionClass = `flex flex-col max-w-[36ch] justify-between items-stretch rounded-lg dark:rounded border-2 dark:border-4 border-transparent px-5 py-4 hover:border-blue-300 hover:bg-stone-100 dark:hover:bg-crt_background_darker group dark:hover:text-crt_amber`

  const colorTypes: Record<FeedCategory, string> = { [FeedCategory.DEFAULT]: 'hover:border-zinc-400', [FeedCategory.TECH]: 'hover:border-retro_blue', [FeedCategory.GASTRO]: 'hover:border-retro_red', [FeedCategory.FRONTEND]: 'hover:border-retro_orange', [FeedCategory.IT]: 'hover:border-retro_green' }

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

      <div className={`my-0 mx-0 max-w-[30ch] text-justify bg-opacity-50 dark:group-hover:bg-opacity-90`}>{formatText(feedDescription)}</div>

    </section>
  );
}

export default FeedSection;
