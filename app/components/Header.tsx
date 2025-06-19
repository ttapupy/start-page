"use client";

import * as React from "react";
import type { FC } from "react";
import FeedSelector from "./FeedSelector";
import ThemeSwitcher from "./ThemeSwitcher";
import type { FieldValues } from "react-hook-form";
import { SourceType } from "@/common";

interface HeaderProps {
  onCheck: (feeds: FieldValues) => Promise<void>;
  selectedFeeds: string[];
  sourceEntries: [string, SourceType][];
}

const Header: FC<HeaderProps> = ({ onCheck, selectedFeeds, sourceEntries }) => {
  const downScroll = React.useRef(false);
  const prevScrollPosition = React.useRef(0);
  const [scrollDown, setScrollDown] = React.useState(false);

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
        className={`fixed top-0 z-[900] flex h-[4em] w-full justify-between bg-stone-400 transition-all duration-500 dark:bg-stone-800 ${
          scrollDown && "scroll-down"
        }`}
      >
        <FeedSelector
          onCheck={onCheck}
          selectedFeeds={selectedFeeds}
          sourceEntries={sourceEntries}
        />
        <ThemeSwitcher />
      </header>
    </>
  );
};

export default Header;
