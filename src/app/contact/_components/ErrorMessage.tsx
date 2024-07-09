"use client";

type ErrorMessageProps = {
  message: string;
};
export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;

  return <p>{message}</p>;
};
