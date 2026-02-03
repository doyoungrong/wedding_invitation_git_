import { useState } from "react";

export default function InvitationSvg() {
  const [copied, setCopied] = useState(false);

  const copyAccount = async () => {
    const text = "기업은행 230310202020";

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // iOS Safari 등 fallback
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
    // ✅ 여기 svg 태그는 네 파일의 최상단 <svg ...>로 바꿔서 붙여넣어
    <svg width="430" height="800" viewBox="0 0 430 800" xmlns="http://www.w3.org/2000/svg">
      {/* ... (네 SVG의 나머지 요소들 전부 그대로 붙여넣기) ... */}

      {/* ✅ 이 부분이 네가 준 rect: "복사하기 버튼" */}
      <g onClick={copyAccount} style={{ cursor: "pointer" }}>
        <rect x="270" y="326" width="88" height="28" rx="14" fill="#D8DD9B" />
        <text
          x={270 + 88 / 2}
          y={326 + 28 / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="12"
          fontWeight="600"
          fill="#2B2B2B"
          style={{ pointerEvents: "none", userSelect: "none" }}
        >
          {copied ? "복사됨!" : "복사하기"}
        </text>
      </g>
    </svg>
  );
}
