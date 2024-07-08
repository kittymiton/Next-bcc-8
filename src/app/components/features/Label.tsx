"use client";

import { FC } from "react";

type LabelProps = {
  htmlFor: string;
  tag: string;
};

export const Label: FC<LabelProps> = ({ htmlFor, tag }) => {
  return <label htmlFor={htmlFor}>{tag}</label>;
};
