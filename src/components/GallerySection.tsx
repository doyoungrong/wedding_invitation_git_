import { useEffect, useMemo, useState } from "react";

// ✅ eager 제거: 번들/로딩 부담 줄이기
const modules = import.meta.glob("../assets/Gallery/G*.jpg", {
  eager: false,
  import: "default",
}) as Record<string, () => Promise<string>>;

function extractNumber(path: string) {
  const m = path.match(/G(\d+)\.jpg$/i);
  return m ? Number(m[1]) : 0;
}

export default function GallerySection() {
  const imageLoaders = useMemo(() => {
    return Object.entries(modules).sort((a, b) => extractNumber(a[0]) - extractNumber(b[0]));
  }, []);

  const [images, setImages] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  // ✅ 갤러리 섹션이 렌더되면 "썸네일용"으로 먼저 로딩
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const list = await Promise.all(imageLoaders.map(([, load]) => load()));
      if (!cancelled) setImages(list);
    })();

    return () => {
      cancelled = true;
    };
  }, [imageLoaders]);

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

  // ✅ 모달에서 다음/이전 이미지를 미리 프리로드(넘길 때 버벅임 감소)
  useEffect(() => {
    if (!open || images.length === 0) return;

    const preload = (src: string) => {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
    };

    const nextIdx = (idx + 1) % images.length;
    const prevIdx = (idx - 1 + images.length) % images.length;

    preload(images[nextIdx]);
    preload(images[prevIdx]);
  }, [open, idx, images]);

  // ✅ 처음 몇 장은 eager로 (스크롤 시 “늦게 뜸” 체감 크게 개선)
  const eagerCount = 9;

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
          <button type="button" className="gallery-backdrop" onClick={close} aria-label="닫기" />

          <div className="gallery-modal-content">
            <button type="button" className="gallery-close" onClick={close} aria-label="닫기">
              ×
            </button>

            <button type="button" className="gallery-nav gallery-prev" onClick={prev} aria-label="이전 사진">
              ‹
            </button>

            <img
              src={images[idx]}
              alt={`확대 사진 ${idx + 1}`}
              className="gallery-modal-img"
              draggable={false}
              decoding="async"
            />

            <button type="button" className="gallery-nav gallery-next" onClick={next} aria-label="다음 사진">
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
