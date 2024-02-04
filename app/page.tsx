import FeedColumn from './components/FeedColumn';
import { sourceCookieName } from "@/app/api/staticdata";
import { cookies } from 'next/headers';
import FeedSelector from './components/FeedSelector';
import { revalidatePath } from 'next/cache';
import ThemeSwitcher from './components/ThemeSwitcher';
import AudioPlaybackProvider from "@/app/components/AudioPlaybackProvider";
import { SourceType } from "@/common";
import Ajv, { JSONSchemaType } from 'ajv';
import getStaticData from "@/app/api/staticdata";


let selectedFeeds: string[] = [];

const ajv = new Ajv();

const schema: JSONSchemaType<SourceType> = {
  type: "object",
  properties: {
    baseURL: { type: "string" },
    name: { type: "string" },
    path: { type: "string" },
    feedCategory: { type: "string" },
    feedType: { type: "string" },
    image: { type: "boolean", nullable: true },
    testUrl: { type: "string", nullable: true },
    testUrl2: { type: "string", nullable: true },
    podcast: { type: "boolean", nullable: true },
  },
  required: ["baseURL", "name", "path", "feedCategory", "feedType"],
  additionalProperties: false
}

export default async function Home() {
  const sources: Record<string, SourceType> = await getStaticData();
  const validate = ajv.compile(schema)
  const cookieStore = cookies()
  const feedCookie = cookieStore.get(sourceCookieName)?.value


  // It's weird but this cookie does not work atm after reload with Firefox in production env
  //ToDo: investigating

  if (feedCookie) {
    const feedCookieArray = await JSON.parse(feedCookie)
    if (Array.isArray(feedCookieArray)) {
      selectedFeeds = feedCookieArray as string[]
    }
  } else if (!!sources && Object.keys(sources)) {
  }

  async function onCheck(feeds: Record<string, boolean>) {
    "use server";

    // After 90 days we reset this cookie
    const keepDays = 90 * 24 * 60 * 60 * 1000

    selectedFeeds = Object.entries(feeds).filter(([_, value]) => value).map(([key, _]) => key)
    // @ts-ignore
    cookies().set(sourceCookieName, JSON.stringify(selectedFeeds), {
      sameSite: 'strict',
      secure: true,
      httpOnly: false,
      // overwrite: true,
      expires: Date.now() + keepDays
    })
    revalidatePath("/")
  }

  if (!sources) return <div>Failed to load the source file. Please try again later.</div>;

  return (
    <>
      <header>
        <FeedSelector
          onCheck={onCheck}
          selectedFeeds={selectedFeeds}
          sourceEntries={Object.entries(sources).filter(([_, value]) => validate(value))}
        />
        <ThemeSwitcher />
      </header>
      <main className="min-h-screen mx-0 px-auto py-6 dark:bg-[#1b1e1d] bg-opacity-30 dark:bg-opacity-30">
        <div className="mb-32 flex flex-row flex-wrap items-stretch justify-evenly text-center px-2">
          <AudioPlaybackProvider>
            {selectedFeeds?.length
              ?
              Object.entries(sources)
                .filter(([key, value]) => selectedFeeds?.includes(key) && validate(value)).sort((a, b) => a[1].name?.toLowerCase() > b[1].name?.toLowerCase() ? 1 : -1)
                .map(([key, value]) => (
                  /* @ts-expect-error Async Server Component */
                  <FeedColumn key={key} sourceKey={key} source={value} />)
                )
              :
              <article
                className="border-2 border-b-crt_foreground rounded p-2"
                title="You can select feeds from the above menu."
              >
                {'There is no source selected.'}
              </article>
            }
          </AudioPlaybackProvider>
        </div>
      </main>
    </>
  )
}
