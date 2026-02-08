import { useState } from "react";
import invitationSvg from "../assets/invitation.svg";

export default function InvitationSvg() {
  const [copied, setCopied] = useState(false);

  const copyTextFallback = async (text: string) => {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    ta.style.top = "-9999px";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    if (!ok) throw new Error("fallback copy failed");
  };

  const copyAccount = async () => {
    const text = "기업은행 230310202020";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      try {
        await copyTextFallback(text);
        setCopied(true);
      } catch {
        // 여기서 필요하면 alert로 안내 가능
      }
    } finally {
      setTimeout(() => setCopied(false), 1200);
    }
  };

  return (
    <div className="invitation">
      <img src={invitationSvg} alt="invitation" className="invitation-img" />

      <button
        type="button"
        onClick={copyAccount}
        className="copy-btn"
        aria-label="계좌 복사"
      />

      {copied && <div className="toast">계좌번호가 복사되었습니다</div>}
    </div>
  );
}
