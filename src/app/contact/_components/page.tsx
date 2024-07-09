"use client";

import { API_BASE_URL } from "@/_constants/constants";
import { Button } from "@/contact/_components/Button";
import { ErrorMessage } from "@/contact/_components/ErrorMessage";
import { Label } from "@/contact/_components/Label";
import { TextArea } from "@/contact/_components/TextArea";
import { TextInput } from "@/contact/_components/TextInput";
import { useState } from "react";

export default function Contact() {
  // ユーザー入力値を保存・表示
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const clearHandler = () => {
    setName("");
    setEmail("");
    setMessage("");
  };

  // エラーメッセージを保存・表示
  const [nameErr, setNameErr] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [messageErr, setMessageErr] = useState("");

  const validate = (): boolean => {
    // エラー判定用
    let flag: boolean = true;

    // エラーメッセージを一時的に保存
    let nameLowError: string = "";
    let emailLowError: string = "";
    let messageLowError: string = "";

    // name=false
    if (!name) {
      nameLowError = "お名前は必須です";
      flag = false;
    } else if (name.length > 30) {
      nameLowError = "お名前は30文字以内で入力してください。";
      flag = false;
    }

    if (!email) {
      emailLowError = "メールアドレスは必須です";
      flag = false;
    } else if (!email.match(/.+@.+\..+/)) {
      emailLowError = "メールアドレスの形式が正しくありません。";
      flag = false;
    }

    if (!message) {
      messageLowError = "本文は必須です。";
      flag = false;
    } else if (message.length > 500) {
      messageLowError = "本文は500文字以内で入力してください。";
      flag = false;
    }

    setNameErr(nameLowError);
    setEmailErr(emailLowError);
    setMessageErr(messageLowError);

    return flag;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const res = await fetch(`${API_BASE_URL}/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) {
        throw new Error("status error");
      }

      alert("送信しました");
    } catch (error) {
      console.error(error);
    }
    clearHandler();
  };

  return (
    <main>
      <h1 className="contact-title">お問い合わせ</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="name" tag="お名前" />
          <div className="write-area">
            <TextInput id="name" type="text" value={name} onChange={(value): void => setName(value)} />
            <ErrorMessage message={nameErr}></ErrorMessage>
          </div>
        </div>
        <div>
          <Label htmlFor="email" tag="メールアドレス" />
          <div className="write-area">
            <TextInput id="email" type="email" value={email} onChange={(value) => setEmail(value)} />
            <ErrorMessage message={emailErr}></ErrorMessage>
          </div>
        </div>
        <div>
          <Label htmlFor="message" tag="本文" />
          <div className="write-area">
            <TextArea id="message" value={message} onChange={(value) => setMessage(value)} rows={12} />
            <ErrorMessage message={messageErr}></ErrorMessage>
          </div>
        </div>
        <div>
          <Button type="submit" tag="送信" />
          <Button type="button" tag="クリア" onClick={clearHandler} />
        </div>
      </form>
    </main>
  );
}
