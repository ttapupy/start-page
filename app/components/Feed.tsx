import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge'
import { FeedType } from "@/common"
import he from 'he'


export default function Feed({ feedList, type }: { feedList: Item[] | null | undefined, type: FeedType }) {
  const sectionClass = 'rounded-lg border-2 border-transparent px-5 py-4 hover:border-blue-300 hover:bg-slate-50'

  const colorTypes: Record<FeedType, string> = { [FeedType.DEFAULT]: 'hover:border-zinc-400', [FeedType.TECH]: 'hover:border-blue-500', [FeedType.GASTRO]: 'hover:border-red-600', [FeedType.ENGLISH]: 'hover:border-amber-500', [FeedType.IT]: 'hover:border-emerald-600' }

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
              className="mb-3 font-semibold hover:underline"

            >{formatText(item.title, true)}</a>

            <div className={`m-0 max-w-[30ch] text-sm opacity-50`}>{formatText(item.description)}</div>

          </section>
        )
      })}
    </>
  )
}