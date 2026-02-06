import { useEffect, useMemo, useState } from "react";


// ✅ Vite에서 정적 파일을 안전하게 불러오는 방식 (추천)
// src/assets/Gallery/G1.png ~ G21.png 를 자동으로 모읍니다.
const modules = import.meta.glob("../assets/Gallery/G*.png", {
  eager: true,
  import: "default",
}) as Record<string, string>;

function extractNumber(path: string) {
  // .../G12.png 같은 파일명에서 12 추출
  const m = path.match(/G(\d+)\.png$/i);
  return m ? Number(m[1]) : 0;
}

export default function GallerySection() {
  const images = useMemo(() => {
    // 파일 경로를 숫자 순서대로 정렬(G1 ~ G21)
    return Object.entries(modules)
      .sort((a, b) => extractNumber(a[0]) - extractNumber(b[0]))
      .map(([, src]) => src);
  }, []);

  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  const openAt = (i: number) => {
    setIdx(i);
    setOpen(true);
  };

  const close = () => setOpen(false);

  const prev = () => setIdx((cur) => (cur - 1 + images.length) % images.length);
  const next = () => setIdx((cur) => (cur + 1) % images.length);

  // ESC로 닫기 + 좌우키 넘김(PC 편의)
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };

    window.addEventListener("keydown", onKeyDown);

    // 모달 열릴 때 스크롤 잠금
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="invitation">
      {/* ✅ 3열, gap 0, 총 7줄(이미지가 21장이면 자동으로 7줄) */}
      <div className="gallery-grid" aria-label="Gallery">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            className="gallery-thumb"
            onClick={() => openAt(i)}
            aria-label={`사진 ${i + 1} 확대`}
          >
            <img src={src} alt={`Gallery ${i + 1}`} className="gallery-thumb-img" />
          </button>
        ))}
      </div>

      {/* ✅ 확대 모달 */}
      {open && (
        <div className="gallery-modal" role="dialog" aria-modal="true">
          {/* 배경 클릭하면 닫기 */}
          <button
            type="button"
            className="gallery-backdrop"
            onClick={close}
            aria-label="닫기"
          />

          <div className="gallery-modal-content">
            {/* 닫기(X) */}
            <button
              type="button"
              className="gallery-close"
              onClick={close}
              aria-label="닫기"
            >
              ×
            </button>

            {/* 좌/우 버튼 */}
            <button
              type="button"
              className="gallery-nav gallery-prev"
              onClick={prev}
              aria-label="이전 사진"
            >
              ‹
            </button>

            <img
              src={images[idx]}
              alt={`확대 사진 ${idx + 1}`}
              className="gallery-modal-img"
              draggable={false}
            />

            <button
              type="button"
              className="gallery-nav gallery-next"
              onClick={next}
              aria-label="다음 사진"
            >
              ›
            </button>

            {/* 하단 카운터(원치 않으면 빼도 됨) */}
            <div className="gallery-counter">
              {idx + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
