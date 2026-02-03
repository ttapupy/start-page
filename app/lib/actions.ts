"use server";

import { cookies } from "next/headers";
import {
  visitedFeedCookieName,
  sourceCookieName,
  customFeedCookieName,
  hiddenFeedCookieName,
  cookieExpirationMs,
  parseCustomFeeds,
  parseHiddenFeeds,
} from "@/app/api/staticdata";
import { revalidatePath } from "next/cache";
import {
  AddCustomFeedResult,
  resolveCustomFeedKey,
  validateCustomFeedUrl,
} from "@/app/lib/customFeedValidation";

export async function getVisitedNews(sourceKey: string) {
  const cookieStore = await cookies();
  const visitedCookie = cookieStore.get(
    `${visitedFeedCookieName}${sourceKey}`,
  )?.value;

  if (visitedCookie && Array.isArray(JSON.parse(visitedCookie))) {
    return await JSON.parse(visitedCookie);
  } else {
    return [] as string[];
  }
}

export async function handleHide(
  link: string,
  sourceKey: string,
  expDays: number,
) {
  const today = new Date();
  let expirationDate = new Date();
  // After some days we reset this cookie
  expirationDate.setDate(today.getDate() + expDays);
  const hiddenNews = (await getVisitedNews(sourceKey)) as string[];
  (await cookies()).set(
    `${visitedFeedCookieName}${sourceKey}`,
    JSON.stringify([...hiddenNews, link]),
    {
      sameSite: "strict",
      secure: true,
      httpOnly: true,
      // overwrite: true,
      expires: expirationDate,
    },
  );
}

export async function onCheck(feeds: Record<string, boolean>) {
  const selectedFeeds = Object.entries(feeds)
    .filter(([_, value]) => value)
    .map(([key, _]) => key);

  (await cookies()).set(sourceCookieName, JSON.stringify(selectedFeeds), {
    sameSite: "strict",
    secure: true,
    httpOnly: false,
    expires: Date.now() + cookieExpirationMs,
  });
  revalidatePath("/");
}

export async function addCustomFeed(
  rawUrl: string,
): Promise<AddCustomFeedResult> {
  try {
    const validation = await validateCustomFeedUrl(rawUrl);
    if (!validation.ok) {
      return validation;
    }

    const { source } = validation;

    const cookieStore = await cookies();
    const current = parseCustomFeeds(
      cookieStore.get(customFeedCookieName)?.value,
    );

    const alreadyRegistered = Object.entries(current).find(
      ([_, existing]) =>
        existing.baseURL === source.baseURL && existing.path === source.path,
    );
    if (alreadyRegistered) {
      return { ok: false, error: "This feed is already registered." };
    }

    const nextKey = resolveCustomFeedKey(source, current);
    const merged = { ...current, [nextKey]: source };

    cookieStore.set(customFeedCookieName, JSON.stringify(merged), {
      sameSite: "strict",
      secure: true,
      httpOnly: true,
      expires: Date.now() + cookieExpirationMs,
    });

    revalidatePath("/");
    return { ok: true, feedKey: nextKey, source };
  } catch (error) {
    console.error("addCustomFeed error:", error);
    return { ok: false, error: "Failed to validate the feed." };
  }
}

export async function removeFeed(feedKey: string, isCustom: boolean) {
  const cookieStore = await cookies();

  if (isCustom) {
    const current = parseCustomFeeds(
      cookieStore.get(customFeedCookieName)?.value,
    );
    const { [feedKey]: _, ...remaining } = current;
    cookieStore.set(customFeedCookieName, JSON.stringify(remaining), {
      sameSite: "strict",
      secure: true,
      httpOnly: true,
      expires: Date.now() + cookieExpirationMs,
    });
  } else {
    const hiddenFeeds = parseHiddenFeeds(
      cookieStore.get(hiddenFeedCookieName)?.value,
    );
    if (!hiddenFeeds.includes(feedKey)) {
      cookieStore.set(
        hiddenFeedCookieName,
        JSON.stringify([...hiddenFeeds, feedKey]),
        {
          sameSite: "strict",
          secure: true,
          httpOnly: true,
          expires: Date.now() + cookieExpirationMs,
        },
      );
    }
  }

  revalidatePath("/");
}
