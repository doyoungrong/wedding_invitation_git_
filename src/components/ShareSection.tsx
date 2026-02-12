import { useEffect, useMemo, useRef, useState } from "react";
import shareSvg from "../assets/Share.svg";

const SHARE_URL = "https://junsungdoyoung.vercel.app/";

type Btn = {
  left: string;
  top: string;
  width: string;
  height: string;
};

export default function ShareSection() {
  const [showToast, setShowToast] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ✅ 빨간 박스 영역(퍼센트) — 새 Share 이미지 기준 "대략" 값
  // 화면에서 조금 안 맞으면 여기 4개 숫자만 살짝 조정하면 됨
  const copyBtn: Btn = useMemo(
    () => ({
      left: "22%",
      top: "28%",
      width: "56%",
      height: "16%",
    }),
    []
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const copyToClipboard = async (text: string) => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
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
  };

  const onCopyClick = async () => {
    try {
      await copyToClipboard(SHARE_URL);

      setShowToast(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setShowToast(false), 1200);
    } catch {
      setShowToast(false);
    }
  };

  return (
    <div className="invitation">
      <div className="share-svg-wrap">
        <img src={shareSvg} alt="Share" className="invitation-img" draggable={false} />

        {/* ✅ 청첩장 주소 복사하기 버튼(빨간 박스) */}
        <button
          type="button"
          className="share-copy-btn"
          style={{
            left: copyBtn.left,
            top: copyBtn.top,
            width: copyBtn.width,
            height: copyBtn.height,
          }}
          onClick={onCopyClick}
          aria-label="청첩장 주소 복사하기"
        />

        {/* ✅ 안내 토스트(버튼 근처) */}
        {showToast && <div className="share-toast">복사가 완료되었습니다.</div>}
      </div>
    </div>
  );
}
