import { parseXMLResponse, getFeed } from "../fetchFeed";
import { FeedType, FeedCategory } from "@/common";

// Mock the xmlParser
jest.mock("../xmlParser", () => ({
  xmlParser: {
    parse: jest.fn(),
  },
}));

describe("parseXMLResponse", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should parse valid XML response", async () => {
    const mockResponse = {
      ok: true,
      text: jest
        .fn()
        .mockResolvedValue("<rss><channel><item></item></channel></rss>"),
    };

    const { xmlParser } = require("../xmlParser");
    xmlParser.parse.mockReturnValue({ rss: { channel: { item: [] } } });

    const result = await parseXMLResponse(mockResponse);

    expect(xmlParser.parse).toHaveBeenCalledWith(
      "<rss><channel><item></item></channel></rss>",
      true,
    );
    expect(result).toEqual({ rss: { channel: { item: [] } } });
  });

  it("should return null for invalid XML", async () => {
    const mockResponse = {
      ok: true,
      text: jest.fn().mockResolvedValue("invalid xml"),
    };

    const { xmlParser } = require("../xmlParser");
    xmlParser.parse.mockImplementation(() => {
      throw new Error("Parse error");
    });

    const result = await parseXMLResponse(mockResponse);

    expect(result).toBeNull();
  });

  it("should throw error for non-ok response", async () => {
    const mockResponse = {
      ok: false,
    };

    await expect(parseXMLResponse(mockResponse)).rejects.toThrow(
      "cannot fetch data",
    );
  });

  it("should return null when parser returns null", async () => {
    const mockResponse = {
      ok: true,
      text: jest.fn().mockResolvedValue("<rss></rss>"),
    };

    const { xmlParser } = require("../xmlParser");
    xmlParser.parse.mockReturnValue(null);

    const result = await parseXMLResponse(mockResponse);

    expect(result).toBeNull();
  });
});

describe("getFeed", () => {
  const mockSource = {
    baseURL: "example.com",
    path: "feed.xml",
    feedType: FeedType.RSS,
    name: "Test Feed",
    feedCategory: FeedCategory.TECH,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should fetch and parse RSS feed successfully", async () => {
    const mockRssData = {
      rss: {
        channel: {
          item: [
            {
              title: { textValue: "Test Article" },
              link: { textValue: "https://example.com/article" },
              summary: { textValue: "Test description" },
            },
          ],
        },
      },
    };

    global.fetch.mockResolvedValue({
      ok: true,
      text: jest
        .fn()
        .mockResolvedValue("<rss><channel><item></item></channel></rss>"),
    });

    const { xmlParser } = require("../xmlParser");
    xmlParser.parse.mockReturnValue(mockRssData);

    const result = await getFeed(mockSource, "test-key");

    expect(fetch).toHaveBeenCalledWith("https://example.com/feed.xml", {
      next: { revalidate: 3600, tags: ["test-key"] },
    });
    expect(result).toEqual(mockRssData.rss.channel.item);
  });

  it("should fetch and parse ATOM feed successfully", async () => {
    const mockAtomData = {
      feed: {
        item: [
          {
            title: { textValue: "Test Article" },
            link: { textValue: "https://example.com/article" },
            summary: { textValue: "Test description" },
          },
        ],
      },
    };

    const atomSource = { ...mockSource, feedType: FeedType.ATOM };

    global.fetch.mockResolvedValue({
      ok: true,
      text: jest.fn().mockResolvedValue("<feed><entry></entry></feed>"),
    });

    const { xmlParser } = require("../xmlParser");
    xmlParser.parse.mockReturnValue(mockAtomData);

    const result = await getFeed(atomSource, "test-key");

    expect(result).toEqual(mockAtomData.feed.item);
  });

  it("should return empty array for unknown feed type", async () => {
    const unknownSource = { ...mockSource, feedType: "unknown" };

    global.fetch.mockResolvedValue({
      ok: true,
      text: jest.fn().mockResolvedValue("<feed></feed>"),
    });

    const result = await getFeed(unknownSource, "test-key");

    expect(result).toEqual([]);
  });

  it("should return empty array when RSS data is malformed", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      text: jest.fn().mockResolvedValue("<rss></rss>"),
    });

    const { xmlParser } = require("../xmlParser");
    xmlParser.parse.mockReturnValue({ rss: {} }); // Missing channel

    const result = await getFeed(mockSource, "test-key");

    expect(result).toEqual([]);
  });

  it("should return empty array when ATOM data is malformed", async () => {
    const atomSource = { ...mockSource, feedType: FeedType.ATOM };

    global.fetch.mockResolvedValue({
      ok: true,
      text: jest.fn().mockResolvedValue("<feed></feed>"),
    });

    const { xmlParser } = require("../xmlParser");
    xmlParser.parse.mockReturnValue({ feed: {} }); // Missing item

    const result = await getFeed(atomSource, "test-key");

    expect(result).toEqual([]);
  });

  it("should handle network errors gracefully", async () => {
    global.fetch.mockRejectedValue(new Error("Network error"));

    const result = await getFeed(mockSource, "test-key");

    expect(result).toEqual([]);
  });

  it("should handle parse errors gracefully", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      text: jest.fn().mockResolvedValue("<rss></rss>"),
    });

    const { xmlParser } = require("../xmlParser");
    xmlParser.parse.mockImplementation(() => {
      throw new Error("Parse error");
    });

    const result = await getFeed(mockSource, "test-key");

    expect(result).toEqual([]);
  });

  it("should encode URL path correctly", async () => {
    const sourceWithSpecialChars = {
      ...mockSource,
      path: "feed with spaces & special chars.xml",
    };

    global.fetch.mockResolvedValue({
      ok: true,
      text: jest.fn().mockResolvedValue("<rss></rss>"),
    });

    const { xmlParser } = require("../xmlParser");
    xmlParser.parse.mockReturnValue({ rss: { channel: { item: [] } } });

    await getFeed(sourceWithSpecialChars, "test-key");

    expect(fetch).toHaveBeenCalledWith(
      "https://example.com/feed%20with%20spaces%20&%20special%20chars.xml",
      { next: { revalidate: 3600, tags: ["test-key"] } },
    );
  });
});
