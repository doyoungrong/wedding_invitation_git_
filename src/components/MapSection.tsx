import { useState } from "react";
import mapSvg from "../assets/Map.svg";

export default function MapSection() {
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    const text = "서울 강남구 도곡로 99길 16";

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // fallback (iOS 일부 환경 대비)
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      ta.style.top = "-9999px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="invitation">
      <div className="map-wrap">
        <img src={mapSvg} alt="Map" className="invitation-img" />

        {/* ✅ Map.svg의 '복사하기' 버튼 위치에 정확히 겹치는 클릭 영역 */}
        <button
          type="button"
          className="map-copy-btn"
          onClick={copyAddress}
          aria-label="주소 복사"
        >
          {copied ? "복사완료!" : "복사하기"}
        </button>
      </div>
    </div>
  );
}
