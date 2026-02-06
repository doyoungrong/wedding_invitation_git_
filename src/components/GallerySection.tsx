import { useEffect, useMemo, useState } from "react";

const modules = import.meta.glob("../assets/Gallery/G*.jpg", {
  eager: true,
  import: "default",
}) as Record<string, string>;

function extractNumber(path: string) {
  const m = path.match(/G(\d+)\.png$/i);
  return m ? Number(m[1]) : 0;
}

export default function GallerySection() {
  const images = useMemo(() => {
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

  return (
    <div className="invitation">
      {/* ✅ 이 문구가 안 보이면 App.tsx에 GallerySection이 안 들어간 상태 */}
      <div style={{ color: "#fff", padding: "12px 0", fontSize: 14 }}>
        ✅ GallerySection rendered / images: {images.length}
      </div>

      {images.length === 0 ? (
        <div style={{ color: "#fff", paddingBottom: 12, fontSize: 12, opacity: 0.8 }}>
          ⚠️ 이미지가 0개예요. (Vercel에서는 폴더/파일 대소문자, git에 png 커밋 여부를 꼭 확인!)
        </div>
      ) : (
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
      )}

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
