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
        position: "relative",
        width: "100%",
        maxWidth: 393,   // ⬅️ SVG 기준 너비 (중요)
        margin: "0 auto",
      }}
    >
      {/* ✅ 원본 SVG 그대로 표시 */}
      <img
        src={invitationSvg}
        alt="invitation"
        style={{ width: "100%", display: "block" }}
      />

      {/* ✅ 복사 버튼만 위에 얹기 */}
      <button
        onClick={copyAccount}
        style={{
          position: "absolute",
          left: 270,
          top: 699,       // ⬅️ SVG 기준 좌표
          width: 88,
          height: 28,
          borderRadius: 14,
          background: "#D8DD9B",
          border: "none",
          cursor: "pointer",
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        {copied ? "복사됨!" : "복사하기"}
      </button>
    </div>
  );
}
