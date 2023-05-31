import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge'
import { FeedType } from "@/common"
import he from 'he'



export default function Feed({ feedList, type }: { feedList: Item[] | null | undefined, type: FeedType }) {
  const sectionClass = `flex flex-col max-w-[36ch] justify-between items-stretch rounded-lg dark:rounded border-2 dark:border-4 border-transparent px-5 py-4 hover:border-blue-300 hover:bg-stone-100 dark:hover:bg-crt_background_darker group dark:hover:text-crt_amber`

  const colorTypes: Record<FeedType, string> = { [FeedType.DEFAULT]: 'hover:border-zinc-400', [FeedType.TECH]: 'hover:border-retro_blue', [FeedType.GASTRO]: 'hover:border-retro_red', [FeedType.ENGLISH]: 'hover:border-retro_orange', [FeedType.IT]: 'hover:border-retro_green' }

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
    let description = decoded.replace(/(\<\/?\w+\>)|(\\n)/g, "").substring(0, maxTextLength)
    return description?.length > maxTextLength - 3 ? `${description.replace(/,?\s+\S*$/, "")}...` : description
  }

  return (
    <>
      {feedList?.map((item, idx) => {
        return (
          <section
            className={twMerge(sectionClass, clsx({ [colorTypes[type]]: true }))}
            key={idx}
          >
            <a
              href={`${item.link || '#'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-3 mx-0 text-justify font-semibold hover:underline max-w-[30ch]"

            >{formatText(item.title, true)}</a>

            <div className={`my-0 mx-0 max-w-[30ch] text-justify text-sm bg-opacity-50 dark:group-hover:bg-opacity-90`}>{formatText(item.description)}</div>

          </section>
        )
      })}
    </>
  )
}