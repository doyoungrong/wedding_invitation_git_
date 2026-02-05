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
      {/* 스케일 컨테이너 */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 480,
        }}
      >
        {/* 비율 유지용 spacer */}
        <div style={{ paddingTop: `${(807 / 393) * 100}%` }} />

        {/* SVG 이미지 */}
        <img
          src={invitationSvg}
          alt="invitation"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "block",
            pointerEvents: "none",
          }}
        />

        {/* 기존 SVG 복사하기 영역 위를 덮는 투명 버튼 */}
        <button
          onClick={copyAccount}
          aria-label="계좌 복사"
          style={{
            position: "absolute",
            left: "68.7%",
            top: "86.6%",
            width: "22.4%",
            height: "3.47%",
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        />
      </div>

      {/* 복사 완료 토스트 */}
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
            zIndex: 9999,
          }}
        >
          계좌번호가 복사되었습니다
        </div>
      )}
    </div>
  );
}
