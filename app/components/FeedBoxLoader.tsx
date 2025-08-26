import { Suspense } from "react";
import { SourceType } from "@/common";
import FeedBoxColumn from "./FeedBoxColumn";
import FeedCardSkeleton from "@/app/components/FeedCardSkeleton";

export default function FeedBoxLoader({
  source,
  sourceKey,
}: {
  source: SourceType;
  sourceKey: string;
}) {
  return (
    <Suspense fallback={<FeedCardSkeleton />}>
      {/*@ts-ignore*/}
      <FeedBoxColumn source={source} sourceKey={sourceKey} />
    </Suspense>
  );
}
