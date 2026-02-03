"use client";
import React, { FC } from "react";
import { UseFormRegister, FieldValues } from "react-hook-form";

export interface ICheckboxProps {
  name: string;
  id: string;
  register: UseFormRegister<FieldValues>;
  isHighlighted?: boolean;
  onChange?: () => void;
}

const Checkbox: FC<ICheckboxProps> = ({
  name,
  id,
  register,
  isHighlighted,
  onChange,
}) => {
  return (
    <>
      <label
        htmlFor={id}
        className={`flex-1 cursor-pointer ${isHighlighted ? "rounded bg-yellow-200 px-1 dark:bg-yellow-600" : ""}`}
      >
        {name}
      </label>
      <input
        type="checkbox"
        id={id}
        {...register(id, { onChange })}
      />
    </>
  );
};

export default Checkbox;
