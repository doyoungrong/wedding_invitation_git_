import { useEffect, useMemo, useRef, useState } from "react"; 

// ✅ JPG + WebP 모두 지원 
const modules = import.meta.glob("../assets/Gallery/G*.{jpg,JPG,webp,WEBP}", { 
  eager: false, 
  import: "default", 
}) as Record<string, () => Promise<string>>; 

function extractNumber(path: string) { 
  // ✅ 확장자 jpg/webp 모두 허용 
  const m = path.match(/G(\d+)\.(?:jpe?g|webp)$/i); 
  return m ? Number(m[1]) : 0; 
} 

export default function GallerySection() { 
  const imageLoaders = useMemo(() => { 
    return Object.entries(modules).sort( 
      (a, b) => extractNumber(a[0]) - extractNumber(b[0]) 
    ); 
  }, []); 
  
  const [images, setImages] = useState<string[]>([]); 
  const [open, setOpen] = useState(false); 
  const [idx, setIdx] = useState(0); 
  
  // ✅ 스와이프용 ref/state 
  const touchStartX = useRef<number | null>(null); 
  const touchStartY = useRef<number | null>(null); 
  
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
    
    // ✅ 수평 스와이프만 인정 (세로 스크롤/움직임 무시) 
    const absX = Math.abs(dx); 
    const absY = Math.abs(dy); 
    
    // 감도: 숫자 클수록 더 “확실히” 쓸어야 넘어감 
    const SWIPE_MIN_X = 45; // 최소 이동거리(px) 
    const SWIPE_MAX_Y = 80; // 세로 흔들림 허용치 
    const HORIZONTAL_RATIO = 1.2; // 수평이 세로보다 이만큼 커야 인정 
    
    if (absX < SWIPE_MIN_X) return; 
    if (absY > SWIPE_MAX_Y) return; 
    if (absX < absY * HORIZONTAL_RATIO) return; 
    
    // ✅ 왼쪽으로 밀면 다음, 오른쪽으로 밀면 이전 
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

          {/* ✅ 스와이프는 이 컨테이너에서 받게 하면 이미지 위에서 쓱 넘기기 가능 */}
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
