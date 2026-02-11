import { useEffect, useRef, useState } from "react";
import shareSvg from "../assets/Share.svg";

const SHARE_URL = "https://junsungdoyoung.vercel.app/";

// window.Kakao 타입 안전 처리
declare global {
  interface Window {
    Kakao?: any;
  }
}

export default function ShareSection() {
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ✅ 카카오 SDK 초기화 (JS KEY 필요)
  useEffect(() => {
    const kakao = window.Kakao;
    const key = import.meta.env.VITE_KAKAO_JS_KEY;

    if (!kakao) return; // SDK 스크립트가 아직 없으면 아무것도 안 함
    if (!key) return;   // 키가 없으면 아무것도 안 함
    if (kakao.isInitialized?.()) return;

    kakao.init(key);
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

  const handleCopy = async () => {
    try {
      await copyToClipboard(SHARE_URL);
      setCopied(true);

      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  const handleKakaoShare = () => {
    const kakao = window.Kakao;

    // ✅ Kakao SDK가 있으면 카카오톡 공유
    if (kakao?.Share?.sendDefault) {
      kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: "청첩장",
          description: "초대합니다 💛",
          imageUrl: "https://dummyimage.com/800x420/eeeeee/000000.png&text=Wedding",
          link: {
            mobileWebUrl: SHARE_URL,
            webUrl: SHARE_URL,
          },
        },
        buttons: [
          {
            title: "청첩장 보기",
            link: {
              mobileWebUrl: SHARE_URL,
              webUrl: SHARE_URL,
            },
          },
        ],
      });
      return;
    }

    // ✅ SDK 없거나 키 없으면 (임시) 링크 열기 fallback
    window.open(SHARE_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="invitation">
      <div className="share-svg-wrap">
        <img src={shareSvg} alt="Share" className="invitation-img" draggable={false} />

        {/* 1) 카카오톡 공유하기 (노란 버튼 영역) */}
        <button
          type="button"
          className="share-btn share-btn-kakao"
          onClick={handleKakaoShare}
          aria-label="카카오톡 공유하기"
        >
          <span className="share-btn-label share-btn-label-kakao">카카오톡 공유하기</span>
        </button>

        {/* 2) 청첩장 주소 복사하기 (파란 버튼 영역) */}
        <button
          type="button"
          className="share-btn share-btn-copy"
          onClick={handleCopy}
          aria-label="청첩장 주소 복사하기"
        >
          <span className="share-btn-label share-btn-label-copy">
            {copied ? "복사완료!" : "청첩장 주소 복사하기"}
          </span>
        </button>
      </div>
    </div>
  );
}
