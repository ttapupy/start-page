import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge'
import { FeedType } from "@/common"


export default function Feed({ feedList, type }: { feedList: Item[] | null | undefined, type: FeedType }) {



  const sectionClass = 'group rounded-lg border-2 border-transparent px-5 py-4 transition-colors hover:border-blue-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800 hover:dark:bg-opacity-30'

  const colorTypes: Record<FeedType, string> = { [FeedType.DEFAULT]: 'hover:border-zinc-400', [FeedType.TECH]: 'hover:border-blue-500', [FeedType.GASTRO]: 'hover:border-red-600', [FeedType.ENGLISH]: 'hover:border-amber-500', [FeedType.IT]: 'hover:border-emerald-600' }

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
            >
              {item.title}
            </a>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              {item.description?.substring(0, 140).replace(/,?\s+\S*$/, "") + '...'}
            </p>

          </section>
        )
      })}
    </>
  )
}