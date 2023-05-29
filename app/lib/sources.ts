import { FeedType } from "@/common"
import { SourceType } from "@/common"

export const sources: Record<string, SourceType> =
{
  gasztroTelex: {
    baseURL: 'https://telex.hu',
    name: 'Telex Gasztro',
    path: 'rss/archivum?filters={"superTagSlugs"%3A["gasztro"]%2C"parentId"%3A["null"]}&perPage=10',
    feedType: FeedType.GASTRO
  },
  techTelex: {
    baseURL: 'https://telex.hu',
    name: 'Telex Tech',
    path: 'rss/archivum?filters={"superTagSlugs"%3A["tech"]%2C"parentId"%3A["null"]}&perPage=10',
    feedType: FeedType.TECH
  },
  hvgTelex: {
    baseURL: 'https://hvg.hu',
    name: 'HVG Tech',
    path: 'rss/tudomany',
    feedType: FeedType.TECH
  },
  techRepublic: {
    baseURL: 'https://www.techrepublic.com',
    name: 'TechRepublic',
    path: 'rssfeeds/articles',
    feedType: FeedType.IT
  }
}


export const sourceCookieName = 'startPageSources'