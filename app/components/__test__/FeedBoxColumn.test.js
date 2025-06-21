import { render, screen } from '@testing-library/react';
import FeedBoxColumn from '../FeedBoxColumn';
import { FeedType, FeedCategory } from '@/common';
import { filterFeedList } from '../../utils/feedBoxUtils';

// Mock the dependencies
jest.mock('../../services/fetchFeed', () => ({
  getFeed: jest.fn(),
}));

jest.mock('../../lib/actions', () => ({
  getVisitedNews: jest.fn(),
}));

jest.mock('../FeedCard', () => {
  return function MockFeedCard({ feedTitle, feedLink }) {
    return (
      <div data-testid="feed-card">
        <h3>{feedTitle}</h3>
        <a href={feedLink}>Link</a>
      </div>
    );
  };
});

jest.mock('../ErrorMessage', () => {
  return function MockErrorMessage() {
    return <div data-testid="error-message">No articles available</div>;
  };
});

describe('FeedBoxColumn Filtering Logic', () => {
  const mockSource = {
    baseURL: 'example.com',
    path: 'feed.xml',
    feedType: FeedType.RSS,
    name: 'Test Feed',
    feedCategory: FeedCategory.TECH,
    testUrl: 'example.com',
  };

  const mockFeedItems = [
    {
      title: { textValue: 'Article 1' },
      link: { textValue: 'https://example.com/article1' },
      summary: { textValue: 'Description 1' },
      guid: { textValue: 'guid1' },
      published: { textValue: '2023-01-01' },
    },
    {
      title: { textValue: 'Article 2' },
      link: { textValue: 'https://example.com/article2' },
      summary: { textValue: 'Description 2' },
      guid: { textValue: 'guid2' },
      published: { textValue: '2023-01-02' },
    },
    {
      title: { textValue: 'Article 3' },
      link: { textValue: 'https://malicious.com/article3' },
      summary: { textValue: 'Description 3' },
      guid: { textValue: 'guid3' },
      published: { textValue: '2023-01-03' },
    },
    {
      title: { textValue: 'Article 4' },
      link: { textValue: 'https://example.com/article4' },
      summary: { textValue: 'Description 4' },
      guid: { textValue: 'guid4' },
      published: { textValue: '2023-01-04' },
    },
    {
      title: { textValue: 'Article 5' },
      link: { textValue: 'https://example.com/article5' },
      summary: { textValue: 'Description 5' },
      guid: { textValue: 'guid5' },
      published: { textValue: '2023-01-05' },
    },
    {
      title: { textValue: 'Article 6' },
      link: { textValue: 'https://example.com/article6' },
      summary: { textValue: 'Description 6' },
      guid: { textValue: 'guid6' },
      published: { textValue: '2023-01-06' },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should filter out malicious links', () => {
    const hiddenNews = [];
    const result = filterFeedList(mockFeedItems, mockSource, hiddenNews, 5);

    // Should only include articles from example.com (not malicious.com)
    expect(result).toHaveLength(5);
    expect(result[0].title.textValue).toBe('Article 1');
    expect(result[1].title.textValue).toBe('Article 2');
    expect(result[2].title.textValue).toBe('Article 4');
    expect(result[3].title.textValue).toBe('Article 5');
    expect(result[4].title.textValue).toBe('Article 6');

    // Article 3 (malicious) should be filtered out
    expect(result.find(item => item.title.textValue === 'Article 3')).toBeUndefined();
  });

  it('should filter out hidden articles', () => {
    const hiddenNews = ['guid2', 'guid4'];
    const result = filterFeedList(mockFeedItems, mockSource, hiddenNews, 5);

    // Should not include hidden articles
    expect(result).toHaveLength(3);
    expect(result[0].title.textValue).toBe('Article 1');
    expect(result[1].title.textValue).toBe('Article 5');
    expect(result[2].title.textValue).toBe('Article 6');

    // Hidden articles should be filtered out
    expect(result.find(item => item.title.textValue === 'Article 2')).toBeUndefined();
    expect(result.find(item => item.title.textValue === 'Article 4')).toBeUndefined();
  });

  it('should limit results to 5 articles', () => {
    const hiddenNews = [];
    const result = filterFeedList(mockFeedItems, mockSource, hiddenNews, 5);

    expect(result).toHaveLength(5);
  });

  it('should handle articles without links', () => {
    const hiddenNews = [];
    const itemsWithoutLinks = [
      {
        title: { textValue: 'Article without link' },
        summary: { textValue: 'Description' },
        guid: { textValue: 'guid1' },
        published: { textValue: '2023-01-01' },
      },
    ];
    const result = filterFeedList(itemsWithoutLinks, mockSource, hiddenNews, 5);

    expect(result).toHaveLength(1);
    expect(result[0].title.textValue).toBe('Article without link');
  });

  it('should handle articles without guid or link', () => {
    const itemsWithoutGuid = [
      {
        title: { textValue: 'Article without guid' },
        link: { textValue: 'https://example.com/article' },
        summary: { textValue: 'Description' },
        published: { textValue: '2023-01-01' },
      },
    ];

    const hiddenNews = [];
    const result = filterFeedList(itemsWithoutGuid, mockSource, hiddenNews, 5);

    expect(result).toHaveLength(1);
    expect(result[0].title.textValue).toBe('Article without guid');
  });

  it('should use testUrl2 when testUrl is not available', () => {
    const sourceWithTestUrl2 = {
      ...mockSource,
      testUrl: undefined,
      testUrl2: 'alternate.com',
    };

    const itemsWithAlternateDomain = [
      {
        title: { textValue: 'Article from alternate domain' },
        link: { textValue: 'https://alternate.com/article' },
        summary: { textValue: 'Description' },
        guid: { textValue: 'guid1' },
        published: { textValue: '2023-01-01' },
      },
    ];

    const hiddenNews = [];
    const result = filterFeedList(itemsWithAlternateDomain, sourceWithTestUrl2, hiddenNews, 5);

    expect(result).toHaveLength(1);
    expect(result[0].title.textValue).toBe('Article from alternate domain');
  });

  it('should fall back to baseURL when no testUrl is provided', () => {
    const sourceWithoutTestUrl = {
      ...mockSource,
      testUrl: undefined,
      testUrl2: undefined,
    };

    const hiddenNews = [];
    const result = filterFeedList(mockFeedItems, sourceWithoutTestUrl, hiddenNews, 5);

    expect(result).toHaveLength(5);
    expect(result[0].title.textValue).toBe('Article 1');
  });

  it('should return empty array when all articles are filtered out', () => {
    const hiddenNews = ['guid1', 'guid2', 'guid4', 'guid5', 'guid6'];
    const result = filterFeedList(mockFeedItems, mockSource, hiddenNews, 5);

    expect(result).toHaveLength(0);
  });

  it('should handle empty feed list', () => {
    const hiddenNews = [];
    const result = filterFeedList([], mockSource, hiddenNews, 5);

    expect(result).toHaveLength(0);
  });

  it('should handle null/undefined feed list', () => {
    const hiddenNews = [];
    const result = filterFeedList(null, mockSource, hiddenNews, 5);

    expect(result).toHaveLength(0);
  });
});
