import { useEffect, useMemo, useRef, useState } from "react";
import shareSvg from "../assets/Share.svg";

declare global {
  interface Window {
    Kakao?: any;
  }
}

const SHARE_URL = "https://junsungdoyoung.vercel.app/";
const SHARE_TITLE = "청첩장";
const SHARE_DESC = "초대합니다 💛";

type Btn = {
  id: string;
  left: string;
  top: string;
  width: string;
  height: string;
};

export default function ShareSection() {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ✅ (중요) 버튼 영역을 넉넉하게 잡아서 "안 눌림"부터 해결
  const btns: { kakao: Btn; copy: Btn } = useMemo(
    () => ({
      // 카카오톡 공유하기(상단 버튼 영역 넓게)
      kakao: { id: "kakao", left: "10%", top: "22%", width: "80%", height: "18%" },
      // 주소 복사(하단 버튼 영역 넓게)
      copy: { id: "copy", left: "10%", top: "45%", width: "80%", height: "18%" },
    }),
    []
  );

  useEffect(() => {
    try {
      const k = window.Kakao;
      if (!k) return;

      if (!k.isInitialized?.()) {
        const KAKAO_JS_KEY = import.meta.env.VITE_KAKAO_KEY as string | undefined;
        if (!KAKAO_JS_KEY) {
          console.warn("VITE_KAKAO_KEY is missing");
          return;
        }
        k.init(KAKAO_JS_KEY);
      }
    } catch (e) {
      console.warn("Kakao init error", e);
    }
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
      setCopied(true);

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  const onKakaoClick = () => {
    const k = window.Kakao;

    // ✅ SDK가 없거나 초기화가 안 됐으면: 링크 복사로 fallback
    if (!k?.isInitialized?.() || !k?.Share?.sendDefault) {
      onCopyClick();
      return;
    }

    try {
      k.Share.sendDefault({
        objectType: "feed",
        content: {
          title: SHARE_TITLE,
          description: SHARE_DESC,
          imageUrl: "https://dummyimage.com/800x420/eeeeee/000000.png&text=Invitation",
          link: { mobileWebUrl: SHARE_URL, webUrl: SHARE_URL },
        },
        buttons: [{ title: "청첩장 열기", link: { mobileWebUrl: SHARE_URL, webUrl: SHARE_URL } }],
      });
    } catch {
      onCopyClick();
    }
  };

  return (
    <div className="invitation">
      <div className="share-svg-wrap">
        <img src={shareSvg} alt="Share" className="invitation-img" draggable={false} />

        {/* 카카오톡 공유하기 버튼 */}
        <button
          type="button"
          className="share-btn"
          style={{
            left: btns.kakao.left,
            top: btns.kakao.top,
            width: btns.kakao.width,
            height: btns.kakao.height,
          }}
          onClick={onKakaoClick}
          aria-label="카카오톡 공유하기"
        >
          <span className="share-btn-label share-btn-label-dark">카카오톡 공유하기</span>
        </button>

        {/* 주소 복사 버튼 */}
        <button
          type="button"
          className="share-btn"
          style={{
            left: btns.copy.left,
            top: btns.copy.top,
            width: btns.copy.width,
            height: btns.copy.height,
          }}
          onClick={onCopyClick}
          aria-label="청첩장 주소 복사하기"
        >
          <span className="share-btn-label share-btn-label-light">
            {copied ? "복사완료!" : "청첩장 주소 복사하기"}
          </span>
        </button>
      </div>
    </div>
  );
}
