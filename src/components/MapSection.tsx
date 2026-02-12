import { useRef, useState } from "react";
import mapSvg from "../assets/Map.svg";

export default function MapSection() {
  const [showToast, setShowToast] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copyAddress = async () => {
    const text = "서울 강남구 도곡로 99길 16";

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
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

      setShowToast(true);

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setShowToast(false);
      }, 1200);

    } catch {
      setShowToast(false);
    }
  };

  return (
    <div className="invitation">
      <div className="map-svg-wrap">
        <img src={mapSvg} alt="Map" className="invitation-img" />

        <button
          type="button"
          className="map-copy-btn"
          onClick={copyAddress}
          aria-label="주소 복사"
        >
          복사하기
        </button>

        {/* ✅ 안내창 */}
        {showToast && (
          <div className="map-toast">
            복사가 완료되었습니다.
          </div>
        )}
      </div>
    </div>
  );
}
