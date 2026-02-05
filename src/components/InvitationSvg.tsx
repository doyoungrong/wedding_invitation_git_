import { useState } from "react";
import invitationSvg from "../assets/invitation.svg";

export default function InvitationSvg() {
  const [copied, setCopied] = useState(false);

  const copyAccount = async () => {
    const text = "기업은행 230310202020";
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="invitation">
      <img
        src={invitationSvg}
        alt="invitation"
        className="invitation-img"
      />

      <button
        onClick={copyAccount}
        className="copy-btn"
        aria-label="계좌 복사"
      />

      {copied && (
        <div className="toast">
          계좌번호가 복사되었습니다
        </div>
      )}
    </div>
  );
}
