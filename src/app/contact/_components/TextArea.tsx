"use client";

import { FC } from "react";

type TextAreaProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  rows: number;
};

export const TextArea: FC<TextAreaProps> = ({ id, value, onChange, rows }) => {
  return <textarea id={id} value={value} onChange={(e) => onChange(e.target.value)} rows={rows} />;
};
