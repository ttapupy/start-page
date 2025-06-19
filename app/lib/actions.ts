"use server";

import { cookies } from "next/headers";
import { visitedFeedCookieName } from "@/app/api/staticdata";

export async function getVisitedNews(sourceKey: string) {
  const cookieStore = await cookies();
  const visitedCookie = cookieStore.get(
    `${visitedFeedCookieName}${sourceKey}`
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
  expDays: number
) {
  const today = new Date();
  let expirationDate = new Date();
  // After some days we reset this cookie
  expirationDate.setDate(today.getDate() + expDays);
  const hiddenNews = (await getVisitedNews(sourceKey)) as string[];
  // @ts-ignore
  cookies().set(
    `${visitedFeedCookieName}${sourceKey}`,
    JSON.stringify([...hiddenNews, link]),
    {
      sameSite: "strict",
      secure: true,
      httpOnly: true,
      // overwrite: true,
      expires: expirationDate,
    }
  );
}
