import { SourceType, FeedType, FeedCategory } from "@/common"

export const sources: Record<string, SourceType> =
{
  gasztroTelex: {
    baseURL: 'telex.hu',
    name: 'Telex Gasztro',
    path: 'rss/archivum?filters={"superTagSlugs"%3A["gasztro"]%2C"parentId"%3A["null"]}&perPage=10',
    feedCategory: FeedCategory.OUT,
    feedType: FeedType.RSS
  },
  techTelex: {
    baseURL: 'telex.hu',
    name: 'Telex Tech',
    path: 'rss/archivum?filters={"superTagSlugs"%3A["tech"]%2C"parentId"%3A["null"]}&perPage=10',
    feedCategory: FeedCategory.TECH,
    feedType: FeedType.RSS
  },
  hvgTelex: {
    baseURL: 'hvg.hu',
    name: 'HVG Tech',
    path: 'rss/tudomany',
    feedCategory: FeedCategory.TECH,
    feedType: FeedType.RSS
  },
  techRepublic: {
    baseURL: 'www.techrepublic.com',
    name: 'TechRepublic',
    path: 'rssfeeds/articles',
    feedCategory: FeedCategory.IT,
    feedType: FeedType.RSS
  },
  codrops: {
    baseURL: 'tympanus.net',
    name: 'codrops',
    path: 'codrops/feed',
    feedCategory: FeedCategory.FRONTEND,
    feedType: FeedType.RSS
  },
  cssTricks: {
    baseURL: 'css-tricks.com',
    name: 'css-tricks',
    path: 'feed',
    feedCategory: FeedCategory.FRONTEND,
    feedType: FeedType.RSS
  },
  devTo: {
    baseURL: 'dev.to',
    name: 'DEV',
    path: 'feed',
    feedCategory: FeedCategory.IT,
    feedType: FeedType.RSS
  },
  stackOverflowJavaScript: {
    baseURL: 'stackoverflow.com',
    name: 'SO JavaScript',
    path: 'feeds/tag?tagnames=javascript&amp;sort=newest',
    feedCategory: FeedCategory.FRONTEND,
    feedType: FeedType.ATOM
  },
  stackOverflowCSS: {
    baseURL: 'stackoverflow.com',
    name: 'SO CSS',
    path: 'feeds/tag?tagnames=css&amp;sort=newest',
    feedCategory: FeedCategory.FRONTEND,
    feedType: FeedType.ATOM
  },
  xkcd: {
    baseURL: 'xkcd.com',
    name: 'xkcd webcomic',
    path: 'rss.xml',
    feedCategory: FeedCategory.OUT,
    feedType: FeedType.RSS,
    image: true
  },
}


export const sourceCookieName = 'startPageSources'