import { SourceType } from "@/common";

export const getText = (prop: FeedTag | GuidTag | undefined) =>
  prop?.["textValue"] || "";

export const filterFeedList = (feedList: FeedItem[], source: SourceType, hiddenNews: string[], listLength: number) => {
  if (!feedList) return [];

  // disallowing suspicious links and also filtering out hidden (by user) news
  const regex = new RegExp(
    `^https?:\/\/(www\.)?${source.testUrl || source.testUrl2 || source.baseURL
    }.*$`
  );

  return feedList
    ?.filter((elem) => !elem["link"] || getText(elem?.["link"])?.match(regex))
    .filter((e) => {
      const guidOrLink = e.guid?.textValue ?? e.link?.textValue;
      return (
        !(e.guid?.textValue || e.link?.textValue) ||
        !hiddenNews.includes(guidOrLink)
      );
    })
    .slice(0, listLength);
}