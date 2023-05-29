"use client"
import * as React from 'react';
import { sources } from "../lib/sources";
import { useForm, FieldValues } from "react-hook-form";


export default function FeedSelector({ onCheck, selectedFeeds }: { onCheck: (feeds: FieldValues) => Promise<void>, selectedFeeds: string[] }) {

  const { handleSubmit, register } = useForm();

  const onSubmit = (data: FieldValues) => {
    onCheck(data)
  }


  return (
    <>
      <form key='feed-selector' onSubmit={handleSubmit(onSubmit)} className="m-3">
        {Object.entries(sources).map(([key, value], idx) => {
          const name = value.name
          return (
            <div key={idx} className="p-1">
              <label htmlFor={key}>
                {name}
                <input
                  defaultChecked={selectedFeeds.includes(key)}
                  className="mx-2"
                  type="checkbox"
                  readOnly
                  {...register(key)}
                />
              </label>
            </div>
          )
        })}
        <button
          type="submit"
          className="bg-blue-400 disabled:bg-gray-500 inline-flex items-center justify-center rounded py-2 px-5 text-center text-base font-normal text-white hover:bg-opacity-90 lg:px-4 xl:px-5"
        >
          {'Save'}
        </button>
      </form>
    </>

  )
}
