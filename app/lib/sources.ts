import { FeedType } from "@/common"
import { SourceType } from "@/common"

export const sources: SourceType[] = [
  {
    baseURL: 'https://telex.hu',
    name: 'Telex Gasztro',
    ref: 'gasztroTelex',
    path: 'rss/archivum?filters={"superTagSlugs"%3A["gasztro"]%2C"parentId"%3A["null"]}&perPage=10',
    feedType: FeedType.GASTRO
  },
  {
    baseURL: 'https://telex.hu',
    name: 'Telex Tech',
    ref: 'techTelex',
    path: 'rss/archivum?filters={"superTagSlugs"%3A["tech"]%2C"parentId"%3A["null"]}&perPage=10',
    feedType: FeedType.TECH
  },
  {
    baseURL: 'https://hvg.hu',
    name: 'HVG Tech',
    ref: 'hvgTelex',
    path: 'rss/tudomany',
    feedType: FeedType.TECH
  },
  {
    baseURL: 'https://www.techrepublic.com',
    name: 'TechRepublic',
    ref: 'techRepublic',
    path: 'rssfeeds/articles',
    feedType: FeedType.IT
  },

]