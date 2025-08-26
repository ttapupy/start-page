import { sourceCookieName } from "@/app/api/staticdata";
import { cookies } from "next/headers";
import AudioPlaybackProvider from "@/app/components/AudioPlaybackProvider";
import { SourceType } from "@/common";
import Ajv, { JSONSchemaType } from "ajv";
import getStaticData from "@/app/api/staticdata";
import Header from "./components/Header";
import FeedBoxLoader from "@/app/components/FeedBoxLoader";
import { onCheck } from "./lib/actions";

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
  additionalProperties: false,
};

export default async function Home() {
  const sources: Record<string, SourceType> = await getStaticData();
  const validate = ajv.compile(schema);
  const cookieStore = await cookies();
  const feedCookie = cookieStore.get(sourceCookieName)?.value;

  if (feedCookie) {
    const feedCookieArray = await JSON.parse(feedCookie);
    if (Array.isArray(feedCookieArray)) {
      selectedFeeds = feedCookieArray as string[];
    }
  } else if (!!sources && Object.keys(sources)) {
  }

  if (!sources)
    return <div>Failed to load the source file. Please try again later.</div>;

  return (
    <>
      <Header
        onCheck={onCheck}
        selectedFeeds={selectedFeeds}
        sourceEntries={Object.entries(sources).filter(([_, value]) =>
          validate(value),
        )}
      />
      <main className="px-auto mx-0 min-h-screen bg-opacity-30 py-8 dark:bg-[#1b1e1d] dark:bg-opacity-30">
        <div className="mb-32 flex flex-row flex-wrap items-stretch justify-evenly px-2 text-center">
          <AudioPlaybackProvider>
            {selectedFeeds?.length ? (
              Object.entries(sources)
                .filter(
                  ([key, value]) =>
                    selectedFeeds?.includes(key) && validate(value),
                )
                .sort((a, b) =>
                  a[1].name?.toLowerCase() > b[1].name?.toLowerCase() ? 1 : -1,
                )
                .map(([key, value]) => (
                  <FeedBoxLoader key={key} sourceKey={key} source={value} />
                ))
            ) : (
              <article
                className="fixed top-[8em] rounded border-2 border-b-crt_foreground p-2"
                title="You can select feeds from the above menu."
              >
                {"There is no source selected."}
              </article>
            )}
          </AudioPlaybackProvider>
        </div>
      </main>
    </>
  );
}
