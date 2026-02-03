"use client";
import React, { FC } from "react";
import { UseFormRegister, FieldValues } from "react-hook-form";

export interface ICheckboxProps {
  selectedFeeds: string[];
  name: string;
  id: string;
  register: UseFormRegister<FieldValues>;
  isHighlighted?: boolean;
}

const Checkbox: FC<ICheckboxProps> = ({
  selectedFeeds,
  name,
  id,
  register,
  isHighlighted,
}) => {
  return (
    <>
      <label
        htmlFor={id}
        className={isHighlighted ? "rounded bg-yellow-200 px-1 dark:bg-yellow-600" : ""}
      >
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
};

export default Checkbox;
