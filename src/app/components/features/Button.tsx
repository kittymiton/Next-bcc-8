"use client";

import { FC } from "react";

interface ButtonProps {
  type: "submit" | "button";
  tag: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const Button: FC<ButtonProps> = ({ type, tag, onClick }) => {
  return (
    <button type={type} onClick={onClick}>
      {tag}
    </button>
  );
};
