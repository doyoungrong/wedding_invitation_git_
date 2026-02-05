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
        maxWidth: 393,
        margin: "0 auto",
      }}
    >
      {/* SVG는 디자인만 담당 */}
      <img
        src={invitationSvg}
        alt="invitation"
        style={{
          width: "100%",
          display: "block",
          pointerEvents: "none", // 🔴 SVG는 클릭 안 받음
        }}
      />

      {/* 👇 기존 SVG 속 '복사하기' 위를 덮는 투명 버튼 */}
      <button
        onClick={copyAccount}
        aria-label="계좌 복사"
        style={{
          position: "absolute",

          /* 🔑 중요: px → % 로 변경 (모바일 대응 핵심) */
          left: "68.7%",   // 270 / 393 * 100
          top: "86.6%",    // 699 / 807 * 100
          width: "22.4%",  // 88 / 393 * 100
          height: "3.47%", // 28 / 807 * 100

          background: "transparent", // 🔴 새 버튼이 보이지 않게
          border: "none",
          cursor: "pointer",
        }}
      />

      {/* 선택: 복사 완료 안내 (UI에 안 보이게 하고 싶으면 제거 가능) */}
      {copied && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.75)",
            color: "#fff",
            padding: "8px 12px",
            borderRadius: 8,
            fontSize: 12,
          }}
        >
          계좌번호가 복사되었습니다
        </div>
      )}
    </div>
  );
}
