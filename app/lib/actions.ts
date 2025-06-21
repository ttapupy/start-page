"use server";

import { cookies } from "next/headers";
import { visitedFeedCookieName, sourceCookieName } from "@/app/api/staticdata";
import { revalidatePath } from "next/cache";

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
  // After 90 days we reset this cookie
  const keepDays = 90 * 24 * 60 * 60 * 1000;

  const selectedFeeds = Object.entries(feeds)
    .filter(([_, value]) => value)
    .map(([key, _]) => key);

  (await cookies()).set(sourceCookieName, JSON.stringify(selectedFeeds), {
    sameSite: "strict",
    secure: true,
    httpOnly: false,
    expires: Date.now() + keepDays,
  });
  revalidatePath("/");
}
