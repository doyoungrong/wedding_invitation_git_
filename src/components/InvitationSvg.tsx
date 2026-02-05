import { useState } from "react";
import invitationSvg from "../assets/invitation.svg";

export default function InvitationSvg() {
  const [copied, setCopied] = useState(false);

  const copyAccount = async () => {
    const text = "기업은행 230310202020";

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        background: "#fff",
      }}
    >
      {/* 🔑 스케일 컨테이너 */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 480,        // 👈 PC에서 더 크게
          aspectRatio: "393 / 807",
        }}
      >
        {/* SVG */}
        <img
          src={invitationSvg}
          alt="invitation"
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            pointerEvents: "none",
          }}
        />

        {/* 투명 복사 버튼 */}
        <button
          onClick={copyAccount}
          aria-label="계좌 복사"
          style={{
            po
