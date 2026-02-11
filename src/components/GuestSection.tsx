import { useEffect, useMemo, useState } from "react";
import guestSvg from "../assets/Guest.svg";

const GUESTBOOK_API_URL =
  "https://script.google.com/macros/s/AKfycbz0fL1D9J3rcNjnQ8-AOR0L_Y5tWUuoMP3J_whmzZ24geU5e-Vd2M-9VLdbBPSzMSzh/exec";

type GuestItem = {
  name: string;
  message: string;
  date: string;
};

const PAGE_SIZE = 3;
const PAGE_WINDOW = 10; // ✅ 10페이지씩 묶음

function formatDate(v: unknown) {
  const d = new Date(String(v));
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("ko-KR");
}

export default function GuestSection() {
  const [list, setList] = useState<GuestItem[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));

  const currentMessages = useMemo(() => {
    const start = currentPage * PAGE_SIZE;
    return list.slice(start, start + PAGE_SIZE);
  }, [list, currentPage]);

  const fetchList = async () => {
    const res = await fetch(GUESTBOOK_API_URL, { method: "GET" });
    const data = (await res.json()) as GuestItem[];
    setList([...data].reverse());
  };

  useEffect(() => {
    fetchList().catch(() => {});
  }, []);

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const lines = newValue.split("\n");
    if (lines.length <= 3 && newValue.length <= 65) {
      setMessage(newValue);
    }
  };

  const submit = async () => {
    const n = name.trim();
    const m = message.trim();
    if (!n || !m) return;

    await fetch(GUESTBOOK_API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ name: n, message: m }),
    });

    setName("");
    setMessage("");
    await fetchList();
    setCurrentPage(0);
  };

  // ✅ 현재 묶음 계산
  const currentGroup = Math.floor(currentPage / PAGE_WINDOW);
  const groupStart = currentGroup * PAGE_WINDOW;
  const groupEnd = Math.min(groupStart + PAGE_WINDOW, totalPages);

  const visiblePages = Array.from(
    { length: groupEnd - groupStart },
    (_, i) => groupStart + i
  );

  // ✅ 묶음 단위 이동
  const goToPrevGroup = () => {
    if (groupStart === 0) return;
    setCurrentPage(groupStart - PAGE_WINDOW);
  };

  const goToNextGroup = () => {
    if (groupEnd >= totalPages) return;
    setCurrentPage(groupEnd);
  };

  return (
    <div className="invitation">
      <div className="guest-svg-wrap">
        <img src={guestSvg} alt="Guest" className="invitation-img guest-svg-img" />

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름"
          className="guest-name-input"
          maxLength={20}
        />

        <textarea
          value={message}
          onChange={handleMessageChange}
          placeholder="메시지"
          className="guest-message-input"
          maxLength={65}
        />

        <button
          type="button"
          className="guest-submit-btn"
          onClick={submit}
        />

        <div className="guest-list-layer">
          {list.length === 0 ? (
            <div className="guest-empty">아직 작성된 메시지가 없습니다</div>
          ) : (
            currentMessages.map((msg, i) => (
              <div key={`${msg.name}-${msg.date}-${i}`} className="guest-card">
                <div className="guest-card-top">
                  <div className="guest-from">FROM.</div>
                  <div className="guest-name">{msg.name}</div>
                  <div className="guest-date">{formatDate(msg.date)}</div>
                </div>
                <div className="guest-message">{msg.message}</div>
              </div>
            ))
          )}
        </div>

        {/* ✅ 페이지네이션 */}
        {totalPages > 1 && (
          <div className="guest-pagination">
            <button
              type="button"
              className="guest-page-arrow"
              onClick={goToPrevGroup}
              disabled={groupStart === 0}
            >
              ‹
            </button>

            <div className="guest-page-dots">
              {visiblePages.map((pageIdx) => (
                <button
                  key={pageIdx}
                  type="button"
                  className={`guest-page-number ${
                    pageIdx === currentPage ? "is-active" : ""
                  }`}
                  onClick={() => setCurrentPage(pageIdx)}
                >
                  {pageIdx + 1}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="guest-page-arrow"
              onClick={goToNextGroup}
              disabled={groupEnd >= totalPages}
            >
              ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
