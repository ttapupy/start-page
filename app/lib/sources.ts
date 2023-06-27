import {SourceType, FeedType, FeedCategory} from "@/common"

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
      hvgTech: {
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
      stackOverflow: {
        baseURL: 'stackoverflow.com',
        name: 'StackOverflow latest',
        path: 'feeds?sort=newest',
        feedCategory: FeedCategory.FRONTEND,
        feedType: FeedType.ATOM
      },
      levelUp: {
        baseURL: 'levelup.gitconnected.com',
        name: 'Level Up Coding',
        path: 'feed',
        feedCategory: FeedCategory.IT,
        feedType: FeedType.RSS
      },
      xkcd: {
        baseURL: 'xkcd.com',
        name: 'xkcd webcomic',
        path: 'rss.xml',
        feedCategory: FeedCategory.OUT,
        feedType: FeedType.RSS,
        image: true
      },
      vk: {
        baseURL: 'feeds.simplecast.com',
        name: 'Világos Középkor podcast',
        path: 'xyZ5uaBs',
        feedCategory: FeedCategory.OUT,
        feedType: FeedType.RSS,
        testUrl: 'vilagoskozepkor.hu',
        podcast: true
      },
      szertar: {
        baseURL: 'feeds.megaphone.fm',
        name: 'Szertár podcast',
        path: 'BETO8058051558',
        feedCategory: FeedCategory.OUT,
        feedType: FeedType.RSS,
        testUrl: 'szertar.com',
        testUrl2: 'www.podtrac.com',
        podcast: true
      },
    }


export const sourceCookieName = 'startPageSources'