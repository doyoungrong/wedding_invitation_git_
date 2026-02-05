import { useState } from "react";
import invitationSvg from "../assets/invitation.svg";

const DESIGN_WIDTH = 393;

export default function InvitationSvg() {
  const [copied, setCopied] = useState(false);

  const copyAccount = async () => {
    const text = "기업은행 230310202020";
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  // ✅ PC에서만 scale 계산
  const scale =
    typeof window !== "undefined"
      ? Math.min(window.innerWidth / DESIGN_WIDTH, 1.6)
      : 1;

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        background: "#fff",
      }}
    >
      {/* 🔑 scale 컨테이너 */}
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          width: DESIGN_WIDTH,
        }}
      >
        <div style={{ position: "relative" }}>
          <img
            src={invitationSvg}
            alt="invitation"
            style={{
              width: "100%",
              display: "block",
              pointerEvents: "none",
            }}
          />

          {/* 투명 복사 버튼 */}
          <button
            onClick={copyAccount}
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
      </div>

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
