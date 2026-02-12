import { useEffect, useMemo, useRef, useState } from "react";
import guestSvg from "../assets/Guest.svg";

const GUESTBOOK_API_URL =
  "https://script.google.com/macros/s/AKfycbz0fL1D9J3rcNjnQ8-AOR0L_Y5tWUuoMP3J_whmzZ24geU5e-Vd2M-9VLdbBPSzMSzh/exec";

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

  /* ✅ PC 10개 / 모바일 5개 */
  const [pageWindow, setPageWindow] = useState(10);

  // ✅ 작성 완료 토스트
  const [showSubmitToast, setShowSubmitToast] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setPageWindow(window.innerWidth <= 560 ? 5 : 10);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));

  // ✅ currentPage가 totalPages 범위를 벗어나면 보정
  useEffect(() => {
    if (currentPage > totalPages - 1) setCurrentPage(totalPages - 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages]);

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

  // ✅ 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const lines = newValue.split("\n");
    if (lines.length <= 3 && newValue.length <= 65) setMessage(newValue);
  };

 const submit = async () => {
  const n = name.trim();
  const m = message.trim();
  if (!n || !m) return;

  if (toastTimerRef.current) clearTimeout(toastTimerRef.current);

  try {
    await fetch(GUESTBOOK_API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ name: n, message: m }),
    });

    setName("");
    setMessage("");
    await fetchList();
    setCurrentPage(0);

    // ✅ 성공 문구
    setToastMessage("작성이 완료되었습니다.");
  } catch {
    // ✅ 실패 문구
    setToastMessage("죄송합니다. 전송이 실패했습니다. 다시 입력해주세요.");
  }

  // ✅ 3초 후 자동 제거
  toastTimerRef.current = setTimeout(() => {
    setToastMessage(null);
  }, 3000);
};



  /* ✅ 묶음 계산 (1~10 / 11~20 …) (모바일은 1~5 / 6~10 …) */
  const currentGroup = Math.floor(currentPage / pageWindow);
  const groupStart = currentGroup * pageWindow;
  const groupEnd = Math.min(groupStart + pageWindow, totalPages);

  const goToPrevGroup = () => {
    if (groupStart === 0) return;
    // 이전 묶음의 첫 페이지로 이동
    setCurrentPage(Math.max(0, groupStart - pageWindow));
  };

  const goToNextGroup = () => {
    if (groupEnd >= totalPages) return;
    // 다음 묶음의 첫 페이지로 이동
    setCurrentPage(groupEnd);
  };

  return (
    <div className="invitation">
      <div className="guest-svg-wrap">
        <img
          src={guestSvg}
          alt="Guest"
          className="invitation-img guest-svg-img"
        />

        {/* 이름 입력 */}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름"
          className="guest-name-input"
          maxLength={20}
          aria-label="이름 입력"
        />

        {/* 메시지 입력 */}
        <textarea
          value={message}
          onChange={handleMessageChange}
          placeholder="메시지"
          className="guest-message-input"
          maxLength={65}
          aria-label="메시지 입력"
        />

        {/* ✅ 작성 완료 토스트 (메시지 입력 영역 기준으로 CSS에서 맞춤) */}
        {showSubmitToast && (
          <div className="guest-submit-toast" aria-live="polite">
            작성이 완료되었습니다.
          </div>
        )}

        {/* 작성 버튼 */}
        <button
          type="button"
          className="guest-submit-btn"
          onClick={submit}
          aria-label="작성하기"
        />

        {/* 방명록 리스트 */}
        <div className="guest-list-layer" aria-label="방명록 목록">
          {list.length === 0 ? (
            <div className="guest-empty">아직 작성된 메시지가 없습니다</div>
          ) : (
            currentMessages.map((msg, i) => (
              <div
                key={`${msg.name}-${msg.date}-${i}`}
                className="guest-card"
                style={{ ["--i" as any]: i } as React.CSSProperties}
              >
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

        {/* ✅ 숫자형 페이지네이션 (dot 클래스 완전 제거) */}
        {totalPages > 1 && (
          <div className="guest-pagination" aria-label="방명록 페이지네이션">
            <button
              type="button"
              className="guest-page-arrow"
              onClick={goToPrevGroup}
              disabled={groupStart === 0}
              aria-label="이전 페이지 묶음"
            >
              ‹
            </button>

            <div className="guest-page-dots" aria-label="페이지 목록">
              {Array.from({ length: groupEnd - groupStart }, (_, i) => {
                const pageIndex = groupStart + i;
                const isActive = pageIndex === currentPage;

                return (
                  <button
                    key={pageIndex}
                    type="button"
                    className={`guest-page-number ${isActive ? "is-active" : ""}`}
                    onClick={() => setCurrentPage(pageIndex)}
                    aria-current={isActive ? "page" : undefined}
                    aria-label={`${pageIndex + 1}페이지`}
                  >
                    {pageIndex + 1}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              className="guest-page-arrow"
              onClick={goToNextGroup}
              disabled={groupEnd >= totalPages}
              aria-label="다음 페이지 묶음"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
