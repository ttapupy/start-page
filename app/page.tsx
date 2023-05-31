import FeedBox from './components/FeedBox'
import { sources, sourceCookieName } from './lib/sources'
import { cookies } from 'next/headers';
import FeedSelector from './components/FeedSelector';
import { revalidatePath } from 'next/cache';
import ThemeSwitcher from './components/ThemeSwitcher';

let selectedFeeds: string[] = [];

export default async function Home() {

  const cookieStore = cookies()
  const feedCookie = cookieStore.get(sourceCookieName)?.value

  if (feedCookie && Array.isArray(JSON.parse(feedCookie))) {
    selectedFeeds = JSON.parse(feedCookie) as string[]
  } else {
    selectedFeeds = Object.keys(sources)
  }

  async function onCheck(feeds: Record<string, boolean>) {
    "use server";

    selectedFeeds = Object.entries(feeds).filter(([_, value]) => value).map(([key, _]) => key)
    // @ts-ignore
    cookies().set(sourceCookieName, JSON.stringify(selectedFeeds), { sameSite: 'strict', secure: true, httpOnly: true, overwrite: true })
    revalidatePath("/")
  }

  return (
    <>
      <header>
        <FeedSelector onCheck={onCheck} selectedFeeds={selectedFeeds} />
        <ThemeSwitcher />
      </header>
      <main className="min-h-screen mx-3 px-auto py-6">
        <div className="mb-32 flex flex-row flex-wrap items-stretch justify-evenly text-center">

          {/* @ts-expect-error Async Server Component */}
          {Object.entries(sources).filter(([key, value]) => selectedFeeds?.includes(key)).sort((a, b) => a[1].name > b[1].name ? 1 : -1).map(([key, value]) => <FeedBox key={key} source={value} />)}

        </div>
      </main>
    </>
  )
}
