"use client";

import * as React from "react";
import type { FC } from "react";
import FeedSelector from "./FeedSelector";
import ThemeSwitcher from "./ThemeSwitcher";
import { SourceType } from "@/common";
import AddFeedForm from "./AddFeedForm";

interface HeaderProps {
  onCheck: (feeds: Record<string, boolean>) => Promise<void>;
  onAddFeed: (url: string) => Promise<
    | { ok: true; feedKey: string; source: SourceType }
    | { ok: false; error: string }
  >;
  onRemoveFeed: (feedKey: string, isCustom: boolean) => Promise<void>;
  selectedFeeds: string[];
  customFeedKeys: Set<string>;
  sourceEntries: [string, SourceType][];
}

const Header: FC<HeaderProps> = ({
  onCheck,
  onAddFeed,
  onRemoveFeed,
  selectedFeeds,
  customFeedKeys,
  sourceEntries,
}) => {
  const downScroll = React.useRef(false);
  const prevScrollPosition = React.useRef(0);
  const [scrollDown, setScrollDown] = React.useState(false);
  const [showAddFeed, setShowAddFeed] = React.useState(false);
  const [addSuccess, setAddSuccess] = React.useState("");
  const [newlyAddedFeedKey, setNewlyAddedFeedKey] = React.useState<string | null>(null);

  const handleToggleAddFeed = () => {
    setAddSuccess("");
    setShowAddFeed((prev) => !prev);
  };

  const handleCloseAddFeed = () => {
    setShowAddFeed(false);
  };

  const handleAddFeedSuccess = (feedKey: string) => {
    setAddSuccess("Feed registered.");
    setShowAddFeed(false);
    setNewlyAddedFeedKey(feedKey);
  };

  const handleHighlightCleared = () => {
    setNewlyAddedFeedKey(null);
  };

  React.useEffect(() => {
    if (addSuccess) {
      const timer = setTimeout(() => setAddSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [addSuccess]);

  React.useEffect(() => {
    function handleScroll() {
      let scrollPosition = window.scrollY;

      if (scrollPosition === prevScrollPosition.current) {
        return;
      }

      if (scrollPosition > prevScrollPosition.current) {
        if (!downScroll.current) {
          downScroll.current = true;
          setScrollDown(() => true);
        }
      } else {
        if (downScroll.current) {
          downScroll.current = false;
          setScrollDown(() => false);
        }
      }
      prevScrollPosition.current = scrollPosition;
    }
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 z-[900] flex h-[4em] w-full justify-between bg-gray-400 transition-all duration-500 dark:bg-gray-800 ${scrollDown && "scroll-down"
          }`}
      >
        <div className="flex items-center gap-2">
          <FeedSelector
            onCheck={onCheck}
            onRemoveFeed={onRemoveFeed}
            selectedFeeds={selectedFeeds}
            customFeedKeys={customFeedKeys}
            sourceEntries={sourceEntries}
            forceOpenWithHighlight={newlyAddedFeedKey}
            onHighlightCleared={handleHighlightCleared}
          />
          <AddFeedForm
            isOpen={showAddFeed}
            onToggle={handleToggleAddFeed}
            onClose={handleCloseAddFeed}
            onSubmit={onAddFeed}
            onSuccess={handleAddFeedSuccess}
          />
        </div>
        <ThemeSwitcher />
      </header>
      {addSuccess && (
        <div className="fixed top-[4em] left-0 z-[901] w-full px-4">
          <div className="mx-auto w-fit rounded bg-neutral-100 px-3 py-2 text-sm shadow dark:bg-gray-900">
            <span className="text-green-500">{addSuccess}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
