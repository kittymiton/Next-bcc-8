"use client";

import { FC } from "react";

type TextInputProps = {
  id: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
};

export const TextInput: FC<TextInputProps> = ({ id, type, value, onChange }) => {
  return <input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} />;
};
