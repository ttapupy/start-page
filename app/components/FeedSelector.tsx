"use client"
import * as React from 'react';
import {useForm, FieldValues} from "react-hook-form";
import Checkbox from './Checkbox';
import {clsx} from 'clsx';
import {twMerge} from 'tailwind-merge'
import {SourceType} from "@/common";

// For fun the behaviour of this "modal" is controlled by css
export default function FeedSelector({onCheck, selectedFeeds, sourceEntries}: {
  onCheck: (feeds: FieldValues) => Promise<void>,
  selectedFeeds: string[],
  sourceEntries: [string, SourceType][]
}) {

  const {handleSubmit, register} = useForm();

  const onSubmit = (data: FieldValues) => {
    onCheck(data)
    setShowMenu(false)
  }

  const [showMenu, setShowMenu] = React.useState(false)
  const navClass = 'absolute ml-4 mt-10 rounded inset-x-0 top-0 invisible bg-slate-300 delay-0 opacity-0 text-sm max-w-prose z-10 [transition:visibility_0s_ease-out_1000ms,_opacity_1000ms_ease-out_0s]'


  return (
      <div className='relative w-64 ml-2'>
        <button data-dropdown-toggle="menu" onClick={() => setShowMenu(!showMenu)} className="p-4 cursor-pointer"
                id="burger">
          <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
               stroke="currentColor" viewBox="0 0 24 24">
            <path d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>

        <nav
            className={twMerge(navClass, clsx({'visible opacity-100 [transition:visibility_0s_ease-out_0s,_opacity_1000ms_ease-out_0s]': showMenu}))}
            id='menu'>
          <form key='feed-selector' onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center m-3">
            <ul>
              {sourceEntries.sort((a, b) => a[1].name?.toLowerCase() > b[1].name?.toLowerCase() ? 1 : -1).map(([key, value], idx) => {
                const name = value.name
                return (
                    <li key={idx} className="checkbox-menu">
                      <Checkbox selectedFeeds={selectedFeeds} name={name} id={key} register={register}/>
                    </li>
                )
              })}
            </ul>
            <button
                type="submit"
                className="w-20 bg-retro_blue hover:bg-sky-700 disabled:bg-gray-500 inline-flex items-center justify-center rounded mt-4 py-2 px-5 text-center text-base font-normal text-white hover:bg-opacity-90 lg:px-4 xl:px-5"
            >
              {'Save'}
            </button>
          </form>
        </nav>
      </div>
  )
}
