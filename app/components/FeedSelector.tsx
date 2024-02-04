"use client"
import * as React from 'react';
import { useForm, FieldValues } from "react-hook-form";
import Checkbox from './Checkbox';
import { SourceType } from "@/common";


export default function FeedSelector({ onCheck, selectedFeeds, sourceEntries }: {
  onCheck: (feeds: FieldValues) => Promise<void>,
  selectedFeeds: string[],
  sourceEntries: [string, SourceType][]
}) {

  const { handleSubmit, register, reset } = useForm();
  const modalRef = React.useRef<HTMLDialogElement>(null);

  const onSubmit = (data: FieldValues) => {
    onCheck(data)
    modalRef.current?.close()
  }

  const handleShowMenu = () => {
    modalRef.current?.showModal()
  }

  const handleClose = () => {
    modalRef.current?.close()
    reset()
  }

  return (
    <div className='relative w-64 ml-2'>
      <button data-dropdown-toggle="menu" onClick={handleShowMenu} className="p-4 cursor-pointer hover:text-green-300"
        id="burger">
        <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
          stroke="currentColor" viewBox="0 0 24 24">
          <path d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>

      <dialog
        className={'absolute ml-4 mt-10 rounded inset-x-0 top-0 bg-neutral-100 dark:bg-neutral-800 text-sm max-w-prose z-10'}
        id='menu'
        ref={modalRef}
      >
        <section className={'text-left'}>
          <button className="p-2 cursor-pointer hover:text-red-300" onClick={handleClose} title='close'>
            <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
              stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </section>
        <form key='feed-selector' onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center m-3">
          <ul>
            {sourceEntries.sort((a, b) => a[1].name?.toLowerCase() > b[1].name?.toLowerCase() ? 1 : -1).map(([key, value], idx) => {
              const name = value.name
              return (
                <li key={idx} className="checkbox-menu">
                  <Checkbox selectedFeeds={selectedFeeds} name={name} id={key} register={register} />
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
      </dialog>
    </div>
  )
}
