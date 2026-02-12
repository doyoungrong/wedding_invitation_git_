import { useEffect, useMemo, useRef, useState } from "react";
import shareSvg from "../assets/Share.svg";

declare global {
  interface Window {
    Kakao?: any;
  }
}

const SHARE_URL = "https://junsungdoyoung.vercel.app/";
const SHARE_TITLE = "청첩장";
const SHARE_DESC = "초대합니다 💛"; // 임시 문구

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

  // ✅ 버튼 좌표(지금은 예시) — 너가 원하면 같이 딱 맞춰줄게
  const btns: { kakao: Btn; copy: Btn } = useMemo(
    () => ({
      // 빨간 버튼 (카카오톡 공유하기)
      kakao: { id: "kakao", left: "24%", top: "26%", width: "52%", height: "14%" },
      // 파란 버튼 (청첩장 주소 복사하기)
      copy: { id: "copy", left: "24%", top: "45%", width: "52%", height: "14%" },
    }),
    []
  );

  // ✅ SDK가 있어도/없어도 앱이 안 죽도록 방어
  useEffect(() => {
    try {
      const k = window.Kakao;
      if (!k) return;

      // 이미 init 되어있으면 다시 init 하지 않음
      if (!k.isInitialized?.()) {
        // ⚠️ 여기에 네 JavaScript 키 넣어야 함 (예: "xxxxxxxxxxxxxxxxxxxx")
        // 키를 아직 안 넣었으면 일단 빈화면 안나오게 init 안하고 리턴
        const KAKAO_JS_KEY = import.meta.env.VITE_KAKAO_JS_KEY as string | undefined;
        if (!KAKAO_JS_KEY) return;

        k.init(KAKAO_JS_KEY);
      }
    } catch {
      // SDK 문제로 전체가 죽지 않게
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
    // ✅ SDK 없으면 새 창으로라도 공유 가능하게(앱 안 죽게)
    const k = window.Kakao;
    if (!k?.Share?.sendDefault) {
      // SDK 없으면 그냥 링크 복사로 대체(원하면 다른 fallback도 가능)
      onCopyClick();
      return;
    }

    try {
      k.Share.sendDefault({
        objectType: "feed",
        content: {
          title: SHARE_TITLE,
          description: SHARE_DESC,
          imageUrl:
            "https://dummyimage.com/800x420/eeeeee/000000.png&text=Invitation", // 임시 썸네일
          link: { mobileWebUrl: SHARE_URL, webUrl: SHARE_URL },
        },
        buttons: [
          { title: "청첩장 열기", link: { mobileWebUrl: SHARE_URL, webUrl: SHARE_URL } },
        ],
      });
    } catch {
      // 실패해도 흰 화면 안 뜨게
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
