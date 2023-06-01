import { FeedCategory } from "@/common"
import { SourceType } from "@/common"

export const sources: Record<string, SourceType> =
{
  gasztroTelex: {
    baseURL: 'https://telex.hu',
    name: 'Telex Gasztro',
    path: 'rss/archivum?filters={"superTagSlugs"%3A["gasztro"]%2C"parentId"%3A["null"]}&perPage=10',
    feedCategory: FeedCategory.OUT,
    feedType: 'rss'
  },
  techTelex: {
    baseURL: 'https://telex.hu',
    name: 'Telex Tech',
    path: 'rss/archivum?filters={"superTagSlugs"%3A["tech"]%2C"parentId"%3A["null"]}&perPage=10',
    feedCategory: FeedCategory.TECH,
    feedType: 'rss'
  },
  hvgTelex: {
    baseURL: 'https://hvg.hu',
    name: 'HVG Tech',
    path: 'rss/tudomany',
    feedCategory: FeedCategory.TECH,
    feedType: 'rss'
  },
  techRepublic: {
    baseURL: 'https://www.techrepublic.com',
    name: 'TechRepublic',
    path: 'rssfeeds/articles',
    feedCategory: FeedCategory.IT,
    feedType: 'rss'
  },
  codrops: {
    baseURL: 'https://tympanus.net',
    name: 'codrops',
    path: 'codrops/feed',
    feedCategory: FeedCategory.FRONTEND,
    feedType: 'rss'
  },
  cssTricks: {
    baseURL: 'https://css-tricks.com',
    name: 'css-tricks',
    path: 'feed',
    feedCategory: FeedCategory.FRONTEND,
    feedType: 'rss'
  },
  devTo: {
    baseURL: 'https://dev.to',
    name: 'DEV',
    path: 'feed',
    feedCategory: FeedCategory.IT,
    feedType: 'rss'
  },
  stackOverflowJavaScript: {
    baseURL: 'https://stackoverflow.com',
    name: 'SO JavaScript',
    path: 'feeds/tag?tagnames=javascript&amp;sort=newest',
    feedCategory: FeedCategory.FRONTEND,
    feedType: 'atom'
  },
  stackOverflowCSS: {
    baseURL: 'https://stackoverflow.com',
    name: 'SO CSS',
    path: 'feeds/tag?tagnames=css&amp;sort=newest',
    feedCategory: FeedCategory.FRONTEND,
    feedType: 'atom'
  },
  xkcd: {
    baseURL: 'https://xkcd.com',
    name: 'xkcd webcomic',
    path: 'rss.xml',
    feedCategory: FeedCategory.OUT,
    feedType: 'rss',
    image: true
  },
}


export const sourceCookieName = 'startPageSources'