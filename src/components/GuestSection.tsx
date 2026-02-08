import { useEffect, useMemo, useState } from "react";
import guestSvg from "../assets/Guest.svg";

// ✅ 여기에 Apps Script 웹앱 URL 넣어줘
const GUESTBOOK_API_URL = "PASTE_YOUR_GAS_WEBAPP_URL_HERE";

type GuestItem = {
  name: string;
  message: string;
  date: string;
};

const PAGE_SIZE = 3;

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
    // 최신순
    setList([...data].reverse());
  };

  useEffect(() => {
    fetchList().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ 3줄 + 65자 제한 (샘플과 동일)
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

    // ✅ CORS preflight 피하려고 text/plain 사용
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

  const goToPrevPage = () => {
    setCurrentPage((p) => Math.max(0, p - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((p) => Math.min(totalPages - 1, p + 1));
  };

  return (
    <div className="invitation">
      <div className="guest-svg-wrap">
        <img src={guestSvg} alt="Guest" className="invitation-img guest-svg-img" />

        {/* ✅ 이름 입력 (Guest.svg의 '이름' 영역 위) */}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름"
          className="guest-name-input"
          maxLength={20}
          aria-label="이름 입력"
        />

        {/* ✅ 메시지 입력 (65자 + 3줄 제한) */}
        <textarea
          value={message}
          onChange={handleMessageChange}
          placeholder="메시지"
          className="guest-message-input"
          maxLength={65}
          aria-label="메시지 입력"
        />

        {/* ✅ 작성하기 버튼: svg 위 투명 버튼 */}
        <button type="button" className="guest-submit-btn" onClick={submit} aria-label="작성하기" />

        {/* ✅ 메시지 리스트 영역 */}
        <div className="guest-list-layer" aria-label="방명록 목록">
          {list.length === 0 ? (
            <div className="guest-empty">
              아직 작성된 메시지가 없습니다
            </div>
          ) : (
            <>
              {[0, 1, 2].map((i) => {
                const msg = currentMessages[i];
                return (
                  <div key={i} className={`guest-card guest-card-${i + 1}`}>
                    {msg ? (
                      <>
                        <div className="guest-card-top">
                          <div className="guest-from">FROM.</div>
                          <div className="guest-name">{msg.name}</div>
                          <div className="guest-date">{formatDate(msg.date)}</div>
                        </div>

                        <div className="guest-message">
                          {msg.message}
                        </div>
                      </>
                    ) : null}
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* ✅ 페이지네이션: 3개 초과일 때만 표시 */}
        {totalPages > 1 && (
          <div className="guest-pagination" aria-label="방명록 페이지네이션">
            <button
              type="button"
              className="guest-page-arrow"
              onClick={goToPrevPage}
              disabled={currentPage === 0}
              aria-label="이전 페이지"
            >
              ‹
            </button>

            <div className="guest-page-dots">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`guest-dot ${idx === currentPage ? "is-active" : ""}`}
                  onClick={() => setCurrentPage(idx)}
                  aria-label={`${idx + 1}페이지`}
                />
              ))}
            </div>

            <button
              type="button"
              className="guest-page-arrow"
              onClick={goToNextPage}
              disabled={currentPage === totalPages - 1}
              aria-label="다음 페이지"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
