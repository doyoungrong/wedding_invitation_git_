import { useMemo, useRef, useState } from "react";
import invitationSvg from "../assets/invitation.svg";

type CopyBtn = {
  id: string;
  value: string;
  left: string;
  top: string;
  width: string;
  height: string;
};

export default function InvitationSvg() {
  const [activeToastId, setActiveToastId] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copyBtns: CopyBtn[] = useMemo(
    () => [
      {
        id: "copy-1",
        value: "신한은행 110271176730",
        left: "70%",
        top: "40%",
        width: "20%",
        height: "4.2%",
      },
      {
        id: "copy-2",
        value: "신한은행 110391190161",
        left: "70%",
        top: "47.55%",
        width: "20%",
        height: "4.2%",
      },
      {
        id: "copy-3",
        value: "기업은행 21008775301016",
        left: "70%",
        top: "70.98%",
        width: "20%",
        height: "4.2%",
      },
      {
        id: "copy-4",
        value: "농협은행 10012656137387",
        left: "70%",
        top: "78.54%",
        width: "20%",
        height: "4.2%",
      },
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

  const handleCopy = async (id: string, value: string) => {
    try {
      await copyToClipboard(value);

      setActiveToastId(id);

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setActiveToastId(null);
      }, 1200);
    } catch {
      setActiveToastId(null);
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

        {copyBtns.map((b) => (
          <div key={b.id}>
            {/* 복사 버튼 */}
            <button
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
              <span className="invite-copy-label">
                복사하기
              </span>
            </button>

            {/* ✅ 버튼 줄 중앙에 뜨는 토스트 */}
            {activeToastId === b.id && (
              <div
                className="invite-row-toast"
                style={{
                  top: b.top,
                }}
              >
                복사가 완료되었습니다.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
