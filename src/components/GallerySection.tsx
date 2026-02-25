import { useEffect, useMemo, useRef, useState } from "react";

// ✅ URL만 즉시 확보 (이미지 "다운로드/디코딩"를 강제로 하지 않음)
const modules = import.meta.glob("../assets/Gallery/G*.{jpg,JPG,jpeg,JPEG,webp,WEBP}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

function extractNumber(path: string) {
  const m = path.match(/G(\d+)\.(?:jpe?g|webp)$/i);
  return m ? Number(m[1]) : 0;
}

export default function GallerySection() {
  // ✅ 파일 경로 기준으로 정렬한 "URL 리스트"를 만든다
  const images = useMemo(() => {
    return Object.entries(modules)
      .sort((a, b) => extractNumber(a[0]) - extractNumber(b[0]))
      .map(([, url]) => url);
  }, []);

  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  // ✅ 스와이프용 ref/state
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const openAt = (i: number) => {
    setIdx(i);
    setOpen(true);
  };

  const close = () => setOpen(false);

  const prev = () => {
    setIdx((cur) => (cur - 1 + images.length) % images.length);
  };

  const next = () => {
    setIdx((cur) => (cur + 1) % images.length);
  };

  // ✅ 모달 열렸을 때 좌/우 키 + 스크롤 잠금
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };

    window.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // ✅ (안정성 우선) 모달에서의 과도한 프리로드는 모바일 메모리 피크를 키울 수 있어
  // 필요하면 나중에 다시 켜도 됨. 지금은 "리로드 방지"가 우선이라 OFF.

  // ✅ 처음 몇 장 eager 로딩: 모바일 안정성 위해 낮춤 (원하면 0~3으로 조절)
  const eagerCount = 3;

  // ✅ 스와이프 핸들러 (모달에서만 사용)
  const onTouchStart = (e: React.TouchEvent) => {
    if (!open) return;
    const t = e.touches[0];
    touchStartX.current = t.clientX;
    touchStartY.current = t.clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!open) return;
    const startX = touchStartX.current;
    const startY = touchStartY.current;
    touchStartX.current = null;
    touchStartY.current = null;

    if (startX == null || startY == null) return;

    const t = e.changedTouches[0];
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;

    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    const SWIPE_MIN_X = 45; // 최소 이동거리(px)
    const SWIPE_MAX_Y = 80; // 세로 흔들림 허용치
    const HORIZONTAL_RATIO = 1.2; // 수평이 세로보다 이만큼 커야 인정

    if (absX < SWIPE_MIN_X) return;
    if (absY > SWIPE_MAX_Y) return;
    if (absX < absY * HORIZONTAL_RATIO) return;

    if (dx < 0) next();
    else prev();
  };

  return (
    <div className="invitation">
      <div className="gallery-grid" aria-label="Gallery">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            className="gallery-thumb"
            onClick={() => openAt(i)}
            aria-label={`사진 ${i + 1} 확대`}
          >
            <img
              src={src}
              alt={`Gallery ${i + 1}`}
              className="gallery-thumb-img"
              loading={i < eagerCount ? "eager" : "lazy"}
              decoding="async"
            />
          </button>
        ))}
      </div>

      {open && images.length > 0 && (
        <div className="gallery-modal" role="dialog" aria-modal="true">
          <button
            type="button"
            className="gallery-backdrop"
            onClick={close}
            aria-label="닫기"
          />

          <div
            className="gallery-modal-content"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <button
              type="button"
              className="gallery-close"
              onClick={close}
              aria-label="닫기"
            >
              ×
            </button>

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
              decoding="async"
            />

            <button
              type="button"
              className="gallery-nav gallery-next"
              onClick={next}
              aria-label="다음 사진"
            >
              ›
            </button>

            <div className="gallery-counter">
              {idx + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
