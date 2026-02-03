"use client";

import * as React from "react";
import type { FC } from "react";
import FeedSelector from "./FeedSelector";
import ThemeSwitcher from "./ThemeSwitcher";
import type { FieldValues } from "react-hook-form";
import { SourceType } from "@/common";
import AddFeedForm from "./AddFeedForm";

interface HeaderProps {
  onCheck: (feeds: FieldValues) => Promise<void>;
  onAddFeed: (url: string) => Promise<
    | { ok: true; feedKey: string; source: SourceType }
    | { ok: false; error: string }
  >;
  selectedFeeds: string[];
  sourceEntries: [string, SourceType][];
}

const Header: FC<HeaderProps> = ({
  onCheck,
  onAddFeed,
  selectedFeeds,
  sourceEntries,
}) => {
  const downScroll = React.useRef(false);
  const prevScrollPosition = React.useRef(0);
  const [scrollDown, setScrollDown] = React.useState(false);
  const [showAddFeed, setShowAddFeed] = React.useState(false);
  const [feedUrl, setFeedUrl] = React.useState("");
  const [addError, setAddError] = React.useState("");
  const [addSuccess, setAddSuccess] = React.useState("");

  const handleToggleAddFeed = () => {
    setAddError("");
    setAddSuccess("");
    setShowAddFeed((prev) => !prev);
  };

  const handleFeedUrlChange = (value: string) => {
    setFeedUrl(value);
  };

  const handleAddFeedSubmit = async () => {
    setAddError("");
    setAddSuccess("");
    const result = await onAddFeed(feedUrl);
    if (!result.ok) {
      setAddError(result.error);
      return;
    }
    setFeedUrl("");
    setAddSuccess("Feed saved.");
    setShowAddFeed(false);
  };

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
            selectedFeeds={selectedFeeds}
            sourceEntries={sourceEntries}
          />
          <AddFeedForm
            feedUrl={feedUrl}
            isOpen={showAddFeed}
            onToggle={handleToggleAddFeed}
            onChange={handleFeedUrlChange}
            onSubmit={handleAddFeedSubmit}
          />
        </div>
        <ThemeSwitcher />
      </header>
      {(addError || addSuccess) && (
        <div className="fixed top-[4em] left-0 z-[901] w-full px-4">
          <div className="mx-auto w-fit rounded bg-neutral-100 px-3 py-2 text-sm shadow dark:bg-gray-900">
            <span className={addError ? "text-red-500" : "text-green-500"}>
              {addError || addSuccess}
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
