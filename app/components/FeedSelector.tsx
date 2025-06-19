"use client";
import * as React from "react";
import { useForm, FieldValues } from "react-hook-form";
import Checkbox from "./Checkbox";
import { SourceType } from "@/common";

export default function FeedSelector({
  onCheck,
  selectedFeeds,
  sourceEntries,
}: {
  onCheck: (feeds: FieldValues) => Promise<void>;
  selectedFeeds: string[];
  sourceEntries: [string, SourceType][];
}) {
  const { handleSubmit, register, reset } = useForm();
  const modalRef = React.useRef<HTMLDialogElement>(null);

  const onSubmit = async (data: FieldValues) => {
    await onCheck(data);
    modalRef.current?.close();
  };

  const handleShowMenu = () => {
    modalRef.current?.showModal();
  };

  const handleClose = () => {
    modalRef.current?.close();
    reset();
  };

  return (
    <div className="relative ml-2 w-64">
      <button
        data-dropdown-toggle="menu"
        onClick={handleShowMenu}
        className="cursor-pointer p-4 hover:text-green-300"
        id="burger"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>

      <dialog
        className={
          "absolute inset-x-0 top-0 z-10 ml-4 mt-10 max-w-prose rounded bg-neutral-100 text-sm dark:bg-neutral-800"
        }
        id="menu"
        ref={modalRef}
      >
        <section className={"text-left"}>
          <button
            className="cursor-pointer p-2 hover:text-red-300"
            onClick={handleClose}
            title="close"
          >
            <svg
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </section>
        <form
          key="feed-selector"
          onSubmit={handleSubmit(onSubmit)}
          className="m-3 flex flex-col items-center"
        >
          <ul>
            {sourceEntries
              .sort((a, b) =>
                a[1].name?.toLowerCase() > b[1].name?.toLowerCase() ? 1 : -1
              )
              .map(([key, value], idx) => {
                const name = value.name;
                return (
                  <li key={idx} className="checkbox-menu">
                    <Checkbox
                      selectedFeeds={selectedFeeds}
                      name={name}
                      id={key}
                      register={register}
                    />
                  </li>
                );
              })}
          </ul>
          <button
            type="submit"
            className="mt-4 inline-flex w-20 items-center justify-center rounded bg-retro_blue px-5 py-2 text-center text-base font-normal text-white hover:bg-sky-700 hover:bg-opacity-90 disabled:bg-gray-500 lg:px-4 xl:px-5"
          >
            {"Save"}
          </button>
        </form>
      </dialog>
    </div>
  );
}
