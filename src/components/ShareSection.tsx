import { useEffect, useRef, useState } from "react";
import shareSvg from "../assets/Share.svg";

const INVITE_URL = "https://junsungdoyoung.vercel.app/";
// ✅ 카카오 “JavaScript 키” 넣어야 함 (REST API 키 아님)
const KAKAO_JS_KEY = import.meta.env.VITE_KAKAO_JS_KEY as string;

declare global {
  interface Window {
    Kakao?: any;
  }
}

export default function ShareSection() {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const Kakao = window.Kakao;
    if (!Kakao) return;

    // 이미 init 된 경우 재호출하면 에러나는 경우가 있어 방어
    if (!Kakao.isInitialized?.()) {
      Kakao.init(KAKAO_JS_KEY);
    }
  }, []);

  const handleKakaoShare = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const Kakao = window.Kakao;

    // ✅ SDK가 없으면 이동하지 말고 경고만
    if (!Kakao || !Kakao.isInitialized?.()) {
      alert("카카오 공유 준비가 아직 안 됐어요. (SDK/키 설정 확인 필요)");
      return;
    }

    Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "모바일 청첩장",
        description: "청첩장 링크를 확인해 주세요.",
        imageUrl: "https://via.placeholder.com/800x400.png?text=Invitation",
        link: {
          mobileWebUrl: INVITE_URL,
          webUrl: INVITE_URL,
        },
      },
      buttons: [
        {
          title: "청첩장 보기",
          link: { mobileWebUrl: INVITE_URL, webUrl: INVITE_URL },
        },
      ],
    });
  };

  const handleCopyUrl = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(INVITE_URL);
      } else {
        const ta = document.createElement("textarea");
        ta.value = INVITE_URL;
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
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCopied(false), 1200);
    } catch {
      alert("복사에 실패했어요.");
    }
  };

  return (
    <div className="invitation">
      <div className="share-svg-wrap">
        <img src={shareSvg} alt="Share" className="invitation-img" draggable={false} />

        {/* ✅ 빨간 버튼 영역: 카카오톡 공유 */}
        <button
          type="button"
          className="share-kakao-btn"
          onClick={handleKakaoShare}
          aria-label="카카오톡 공유하기"
        />

        {/* ✅ 파란 버튼 영역: 주소 복사 */}
        <button
          type="button"
          className="share-copy-btn"
          onClick={handleCopyUrl}
          aria-label="청첩장 주소 복사하기"
        >
          <span className="share-copy-label">{copied ? "복사완료!" : ""}</span>
        </button>
      </div>
    </div>
  );
}
