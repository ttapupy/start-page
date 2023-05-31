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
      <label htmlFor={id}>
        {name}
      </label>
      <input
        defaultChecked={selectedFeeds.includes(id)}
        type="checkbox"
        readOnly
        id={id}
        {...register(id)}
      />

    </>
  );
}

export default Checkbox;
