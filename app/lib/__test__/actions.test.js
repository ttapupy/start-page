jest.unmock("@/app/lib/actions");

const { FeedCategory, FeedType } = require("@/common");
const { customFeedCookieName } = require("@/app/api/staticdata");

jest.mock("@/app/lib/customFeedValidation", () => {
  const actual = jest.requireActual("@/app/lib/customFeedValidation");
  return {
    ...actual,
    validateCustomFeedUrl: jest.fn(),
  };
});

const { addCustomFeed } = require("@/app/lib/actions");
const { validateCustomFeedUrl } = require("@/app/lib/customFeedValidation");

function makeSource(overrides = {}) {
  return {
    baseURL: "example.com",
    name: "Example Feed",
    path: "feed.xml",
    feedCategory: FeedCategory.DEFAULT,
    feedType: FeedType.RSS,
    ...overrides,
  };
}

describe("addCustomFeed", () => {
  let mockGet;
  let mockSet;

  beforeEach(() => {
    jest.clearAllMocks();
    const { cookies } = require("next/headers");
    mockGet = jest.fn();
    mockSet = jest.fn();
    cookies.mockResolvedValue({ get: mockGet, set: mockSet });
  });

  it("returns validation error when URL is invalid", async () => {
    validateCustomFeedUrl.mockResolvedValue({
      ok: false,
      error: "Only https URLs are allowed.",
    });

    const result = await addCustomFeed("http://example.com/feed.xml");

    expect(result).toEqual({ ok: false, error: "Only https URLs are allowed." });
    expect(validateCustomFeedUrl).toHaveBeenCalledWith("http://example.com/feed.xml");
    expect(mockSet).not.toHaveBeenCalled();
  });

  it("adds a new feed when custom feeds are empty", async () => {
    const source = makeSource();
    validateCustomFeedUrl.mockResolvedValue({ ok: true, source });
    mockGet.mockImplementation((name) =>
      name === customFeedCookieName ? { value: undefined } : undefined,
    );

    const result = await addCustomFeed("https://example.com/feed.xml");

    expect(result.ok).toBe(true);
    expect(result.feedKey).toBeDefined();
    expect(result.source).toEqual(source);
    expect(mockSet).toHaveBeenCalledWith(
      customFeedCookieName,
      expect.any(String),
      expect.any(Object),
    );
    const merged = JSON.parse(mockSet.mock.calls[0][1]);
    expect(Object.keys(merged)).toContain(result.feedKey);
    expect(merged[result.feedKey]).toEqual(source);
  });

  it("adds a new feed when custom feeds already exist", async () => {
    const source = makeSource({ path: "new-feed.xml" });
    validateCustomFeedUrl.mockResolvedValue({ ok: true, source });
    const existing = { existing_com_example_com_feed_xml: { baseURL: "example.com", path: "feed.xml", name: "Old", feedCategory: FeedCategory.DEFAULT, feedType: FeedType.RSS } };
    mockGet.mockImplementation((name) =>
      name === customFeedCookieName
        ? { value: JSON.stringify(existing) }
        : undefined,
    );

    const result = await addCustomFeed("https://example.com/new-feed.xml");

    expect(result.ok).toBe(true);
    expect(result.feedKey).toBeDefined();
    expect(result.source).toEqual(source);
    const merged = JSON.parse(mockSet.mock.calls[0][1]);
    expect(merged[result.feedKey]).toEqual(source);
    expect(merged.existing_com_example_com_feed_xml).toEqual(existing.existing_com_example_com_feed_xml);
  });

  it("returns error when feed is already registered (same baseURL and path)", async () => {
    const source = makeSource({ baseURL: "example.com", path: "feed.xml" });
    validateCustomFeedUrl.mockResolvedValue({ ok: true, source });
    const existing = {
      example_com_feed_xml: makeSource({ baseURL: "example.com", path: "feed.xml" }),
    };
    mockGet.mockImplementation((name) =>
      name === customFeedCookieName
        ? { value: JSON.stringify(existing) }
        : undefined,
    );

    const result = await addCustomFeed("https://example.com/feed.xml");

    expect(result).toEqual({
      ok: false,
      error: "This feed is already registered.",
    });
    expect(mockSet).not.toHaveBeenCalled();
  });

  it("allows adding a feed with same baseURL but different path", async () => {
    const source = makeSource({ baseURL: "example.com", path: "other.xml" });
    validateCustomFeedUrl.mockResolvedValue({ ok: true, source });
    const existing = {
      example_com_feed_xml: makeSource({ baseURL: "example.com", path: "feed.xml" }),
    };
    mockGet.mockImplementation((name) =>
      name === customFeedCookieName
        ? { value: JSON.stringify(existing) }
        : undefined,
    );

    const result = await addCustomFeed("https://example.com/other.xml");

    expect(result.ok).toBe(true);
    expect(result.source.path).toBe("other.xml");
    expect(mockSet).toHaveBeenCalled();
  });

  it("returns generic error when validateCustomFeedUrl throws", async () => {
    validateCustomFeedUrl.mockRejectedValue(new Error("Network error"));
    mockGet.mockImplementation((name) =>
      name === customFeedCookieName ? { value: undefined } : undefined,
    );

    const result = await addCustomFeed("https://example.com/feed.xml");

    expect(result).toEqual({ ok: false, error: "Failed to validate the feed." });
    expect(mockSet).not.toHaveBeenCalled();
  });
});
