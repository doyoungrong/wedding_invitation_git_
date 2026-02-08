import { useEffect, useMemo, useState } from "react";
import guestSvg from "../assets/Guest.svg";

// ✅ 여기에 Apps Script 웹앱 URL 넣기
const GUESTBOOK_API_URL = "https://script.google.com/macros/s/AKfycbz0fL1D9J3rcNjnQ8-AOR0L_Y5tWUuoMP3J_whmzZ24geU5e-Vd2M-9VLdbBPSzMSzh/exec";

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
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const [list, setList] = useState<GuestItem[]>([]);
  const [page, setPage] = useState(0);

  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));

  const pageItems = useMemo(() => {
    const start = page * PAGE_SIZE;
    return list.slice(start, start + PAGE_SIZE);
  }, [list, page]);

  const fetchList = async () => {
    const res = await fetch(GUESTBOOK_API_URL, { method: "GET" });
    const data = (await res.json()) as GuestItem[];
    // 최신순
    setList([...data].reverse());
    setPage(0);
  };

  useEffect(() => {
    fetchList().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async () => {
    const n = name.trim();
    const m = message.trim();

    if (!n || !m) return;

    // ✅ preflight(CORS) 피하려고 text/plain 사용
    await fetch(GUESTBOOK_API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ name: n, message: m }),
    });

    setName("");
    setMessage("");
    await fetchList();
  };

  const prevPage = () => setPage((p) => Math.max(0, p - 1));
  const nextPage = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  return (
    <div className="invitation">
      <div className="guest-svg-wrap">
        <img src={guestSvg} alt="Guest" className="invitation-img guest-svg-img" />

        {/* ✅ 이름 입력: Guest.svg의 '이름' 박스 위에 투명 input */}
        <input
          className="guest-name-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={12}
          aria-label="이름 입력"
        />

        {/* ✅ 메시지 입력: 65자 제한 */}
        <textarea
          className="guest-message-input"
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, 65))}
          aria-label="메시지 입력"
        />

        {/* ✅ 작성하기 버튼: Guest.svg의 버튼 위에 투명 버튼 */}
        <button type="button" className="guest-submit-btn" onClick={submit} aria-label="작성하기" />

        {/* ✅ 방명록 표시 영역 (3칸) */}
        <div className="guest-items-layer" aria-label="방명록 목록">
          {list.length === 0 ? (
            <div className="guest-empty">아직 작성된 메시지가 없습니다</div>
          ) : (
            <>
              {[0, 1, 2].map((i) => {
                const item = pageItems[i];
                return (
                  <div key={i} className={`guest-item guest-item-${i + 1}`}>
                    {item ? (
                      <>
                        <div className="guest-item-top">
                          <span className="guest-item-name">{item.name}</span>
                          <span className="guest-item-date">{formatDate(item.date)}</span>
                        </div>
                        <div className="guest-item-message">{item.message}</div>
                      </>
                    ) : null}
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* ✅ 페이지네이션(3개 초과 시) : 디자인 아래 영역에 얹기 */}
        {list.length > PAGE_SIZE && (
          <div className="guest-pagination">
            <button type="button" className="guest-page-btn" onClick={prevPage} disabled={page === 0}>
              이전
            </button>
            <div className="guest-page-indicator">
              {page + 1} / {totalPages}
            </div>
            <button
              type="button"
              className="guest-page-btn"
              onClick={nextPage}
              disabled={page >= totalPages - 1}
            >
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
