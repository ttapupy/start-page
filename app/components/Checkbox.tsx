"use client"
import React, { FC } from 'react';
import { UseFormRegister, FieldValues } from "react-hook-form";


export interface ICheckboxProps {
  selectedFeeds: string[];
  name: string;
  id: string;
  register: UseFormRegister<FieldValues>;
}


const Checkbox: FC<ICheckboxProps> = ({ selectedFeeds, name, id, register }) => {

  return (
    <>
      <label htmlFor={id} className=''>
        {name}
      </label>
      <input
        defaultChecked={selectedFeeds.includes(id)}
        className="ml-2 rounded ring-slate-400 ring-0 hover:ring-1 focus:ring-0 text-emerald-500 border-0  focus:outline-offset-0 focus:outline-2 focus:outline-slate-500"
        type="checkbox"
        readOnly
        id={id}
        {...register(id)}
      />

    </>
  );
}

export default Checkbox;
