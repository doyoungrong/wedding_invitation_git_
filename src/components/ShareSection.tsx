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

const KAKAO_SDK_SRC = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js";

function loadKakaoSdk(): Promise<void> {
  return new Promise((resolve, reject) => {
    // 이미 로드됨
    if (window.Kakao) {
      resolve();
      return;
    }

    // 이미 script 태그가 있으면 onload만 기다림
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${KAKAO_SDK_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Kakao SDK load error")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = KAKAO_SDK_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Kakao SDK load error"));
    document.head.appendChild(script);
  });
}

export default function ShareSection() {
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
      showToast("복사가 완료되었습니다.");

      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
      copiedTimerRef.current = setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
      showToast("복사에 실패했습니다.");
    }
  };

  // ✅ SDK 로드 + init (Vercel env: VITE_KAKAO_KEY)
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await loadKakaoSdk();
        if (cancelled) return;

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
        console.warn("Kakao SDK init/load error", e);
      }
    })();

    return () => {
      cancelled = true;
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  // ✅ 1) 카카오톡 공유: 준비 안됐으면 “경고” 대신 “링크 복사”로 동작
  const onKakaoClick = async () => {
    const k = window.Kakao;

    // SDK가 없거나 초기화가 안 됐으면 -> 링크 복사로 대체
    if (!k?.isInitialized?.() || !k?.Share?.sendDefault) {
      await onCopyClick();
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
      // 실패하면 링크 복사로 대체 + 토스트
      await onCopyClick();
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
          {/* ✅ 2) “청첩장 주소 복사하기”랑 같은 느낌(흰 글씨) */}
          <span className="share-btn-label share-btn-label-light">카카오톡 공유하기</span>
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

        {/* ✅ 복사 토스트 */}
        {toast && (
          <div className="share-toast" aria-live="polite">
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}
