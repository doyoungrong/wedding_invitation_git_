import { useMemo, useRef, useState } from "react";
import invitationSvg from "../assets/invitation.svg";

/**
 * ✅ 여기서 복사 버튼 영역을 관리해.
 * - id: 버튼 식별자(고유)
 * - value: 복사될 값(임시)
 * - left/top/width/height: Invitation.svg 위에서 버튼 영역(퍼센트로)
 *
 * ❗️지금은 예시 좌표야. 네 svg에서 "복사하기" 텍스트가 있는 위치에 맞게
 *    left/top/width/height만 조정하면 돼.
 */
type CopyBtn = {
  id: string;
  value: string;
  left: string;
  top: string;
  width: string;
  height: string;
};

export default function InvitationSvg() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const copyBtns: CopyBtn[] = useMemo(
    () => [
      // 신랑측 1
      {
        id: "copy-1",
        value: "신한은행 110271176730",
        left: "70%",
        top: "40%",
        width: "20%",
        height: "4.2%",
      },
      // 신랑측 2
      {
        id: "copy-2",
        value: "신한은행 110391190161",
        left: "70%",
        top: "47.55%",
        width: "20%",
        height: "4.2%",
      },
      // 신부측 1
      {
        id: "copy-3",
        value: "기업은행 21008775301016",
        left: "70%",
        top: "70.98%",
        width: "20%",
        height: "4.2%",
      },
      // 신부측 2
      {
        id: "copy-4",
        value: "농협은행 10012656137387",
        left: "70%",
        top: "78.54%",
        width: "20%",
        height: "4.2%",
      },
      // 신부측 3
      {
        id: "copy-5",
        value: "카카오뱅크 3333272646184",
        left: "70%",
        top: "86.28%",
        width: "20%",
        height: "4.2%",
      },
    ],
    []
  );



  const copyToClipboard = async (text: string) => {
    // 1) 표준 Clipboard API
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    // 2) fallback (사파리/권한 이슈 대비)
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

  const handleCopy = async (id: string, value: string) => {
    try {
      await copyToClipboard(value);

      setCopiedId(id);

      // 기존 타이머 정리
      if (timerRef.current) window.clearTimeout(timerRef.current);

      // 1.2초 후 원복
      timerRef.current = window.setTimeout(() => {
        setCopiedId(null);
      }, 1200);
    } catch {
      // 복사 실패해도 UI가 깨지진 않게
      setCopiedId(null);
    }
  };

  return (
    <div className="invitation">
      <div className="invite-svg-wrap">
        <img
          src={invitationSvg}
          alt="Invitation"
          className="invitation-img"
          draggable={false}
        />

        {/* ✅ "복사하기" 위치들에 투명 버튼 덮기 */}
        {copyBtns.map((b) => (
          <button
            key={b.id}
            type="button"
            className="invite-copy-btn"
            style={{
              left: b.left,
              top: b.top,
              width: b.width,
              height: b.height,
            }}
            onClick={() => handleCopy(b.id, b.value)}
            aria-label="복사하기"
          >
            {/* svg 안의 글자 위에 우리가 글자를 올려서, 클릭 시 문구가 바뀌게 */}
            <span className="invite-copy-label">
              {copiedId === b.id ? "복사완료!" : "복사하기"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
