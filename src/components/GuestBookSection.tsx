import { useEffect, useState } from "react";

const API_URL = "🔥여기에_GAS_URL_붙여넣기🔥";

type Guest = {
  name: string;
  message: string;
  date: string;
};

export default function GuestBookSection() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [list, setList] = useState<Guest[]>([]);
  const [page, setPage] = useState(0);

  const PAGE_SIZE = 3;

  const fetchList = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setList(data.reverse()); // 최신순
  };

  const submit = async () => {
    if (!name || !message) return;

    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ name, message })
    });

    setName("");
    setMessage("");
    fetchList();
  };

  useEffect(() => {
    fetchList();
  }, []);

  const start = page * PAGE_SIZE;
  const current = list.slice(start, start + PAGE_SIZE);

  return (
    <div className="invitation">
      <div className="guest-wrap">
        <h3 className="guest-title">방명록</h3>

        <input
          placeholder="이름"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <textarea
          placeholder="축하 메시지를 남겨주세요"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />

        <button onClick={submit}>등록</button>

        <div className="guest-list">
          {current.length === 0 && (
            <div className="empty">아직 작성된 메시지가 없습니다</div>
          )}

          {current.map((g, i) => (
            <div key={i} className="guest-item">
              <strong>{g.name}</strong>
              <p>{g.message}</p>
              <span>{new Date(g.date).toLocaleDateString()}</span>
            </div>
          ))}
        </div>

        {list.length > PAGE_SIZE && (
          <div className="guest-pagination">
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)}>이전</button>
            <button
              disabled={start + PAGE_SIZE >= list.length}
              onClick={() => setPage(p => p + 1)}
            >
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
