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
  const [toast, setToast] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ✅ 버튼 영역 넉넉하게
  const btns: { kakao: Btn; copy: Btn } = useMemo(
    () => ({
      kakao: { id: "kakao", left: "10%", top: "22%", width: "80%", height: "18%" },
      copy: { id: "copy", left: "10%", top: "45%", width: "80%", height: "18%" },
    }),
    []
  );

  const showToast = (msg: string, ms = 1200) => {
    setToast(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), ms);
  };

  // ✅ Kakao SDK init (index.html에 SDK가 이미 있으므로 init만)
  useEffect(() => {
    try {
      const k = window.Kakao;
      if (!k) {
        console.warn("Kakao SDK not loaded (index.html 확인 필요)");
        return;
      }

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

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
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

  // ✅ 2) 주소 복사 + "복사가 완료되었습니다." 토스트
  const onCopyClick = async () => {
    try {
      await copyToClipboard(SHARE_URL);
      setCopied(true);

      showToast("복사가 완료되었습니다.");

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
      showToast("복사에 실패했습니다.");
    }
  };

  // ✅ 1) 카카오톡 열어서 채팅방 선택(공유)
  const onKakaoClick = () => {
    const k = window.Kakao;

    // SDK/초기화/Share 모듈 확인
    if (!k?.isInitialized?.() || !k?.Share?.sendDefault) {
      showToast("카카오 공유 준비가 안 됐어요. (도메인/키 확인)");
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
        buttons: [
          { title: "청첩장 열기", link: { mobileWebUrl: SHARE_URL, webUrl: SHARE_URL } },
        ],
      });
    } catch (e) {
      console.warn("Kakao share error", e);
      showToast("카카오 공유에 실패했습니다. (도메인 등록 여부 확인)");
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

        {/* ✅ 토스트 (Share.svg 위에서만 뜸) */}
        {toast && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "63%",
              transform: "translateX(-50%)",
              background: "rgba(0,0,0,0.75)",
              color: "#fff",
              padding: "8px 14px",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: 600,
              zIndex: 999,
              pointerEvents: "none",
              whiteSpace: "nowrap",
            }}
            aria-live="polite"
          >
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}
