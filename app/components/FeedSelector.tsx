"use client"
import * as React from 'react';
import { sources } from "../lib/sources";
import { useForm, FieldValues } from "react-hook-form";
import Checkbox from './Checkbox';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge'


export default function FeedSelector({ onCheck, selectedFeeds }: { onCheck: (feeds: FieldValues) => Promise<void>, selectedFeeds: string[] }) {

  const { handleSubmit, register } = useForm();

  const onSubmit = (data: FieldValues) => {
    onCheck(data)
    setShowMenu(false)
  }

  const [showMenu, setShowMenu] = React.useState(false)
  const navClass = 'absolute ml-4 mt-6 rounded inset-x-0 top-0 invisible bg-slate-300 delay-0 opacity-0 text-sm max-w-prose z-10 [transition:visibility_0s_ease-out_1000ms,_opacity_1000ms_ease-out_0s]'


  return (
    <div className='relative w-48 ml-2'>
      <button data-dropdown-toggle="menu" onClick={() => setShowMenu(!showMenu)} className="px-4 cursor-pointer" id="burger">
        <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"></path></svg>
      </button>

      <nav className={twMerge(navClass, clsx({ 'visible opacity-100 [transition:visibility_0s_ease-out_0s,_opacity_1000ms_ease-out_0s]': showMenu }))} id='menu'>
        <form key='feed-selector' onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center m-3">
          <ul>
            {Object.entries(sources).map(([key, value], idx) => {
              const name = value.name
              return (
                <li key={idx} className="text-gray-600 font-medium py-1 flex justify-between">
                  <Checkbox selectedFeeds={selectedFeeds} name={name} id={key} register={register} />
                </li>
              )
            })}
          </ul>
          <button
            type="submit"
            className="w-20 bg-sky-600 hover:bg-sky-700 disabled:bg-gray-500 inline-flex items-center justify-center rounded mt-4 py-2 px-5 text-center text-base font-normal text-white hover:bg-opacity-90 lg:px-4 xl:px-5"
          >
            {'Save'}
          </button>
        </form>
      </nav>
    </div>
  )
}
