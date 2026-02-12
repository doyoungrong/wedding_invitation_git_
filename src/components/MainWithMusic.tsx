import { useEffect, useRef, useState } from "react";

// ✅ URL로 가져오기 (번들에 SVG 내용을 안 넣고 정적 에셋으로 분리)
import mainSvgUrl from "../assets/Main.svg?url";
import musicDefaultSvgUrl from "../assets/Music_Default.svg?url";
import musicStopSvgUrl from "../assets/Music_Stop.svg?url";
import bgmUrl from "../assets/bgm.mp3?url";

export default function MainWithMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const initializedRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    // ✅ StrictMode(개발)에서 2번 실행 방지
    if (initializedRef.current) return;
    initializedRef.current = true;

    const audio = new Audio(bgmUrl);
    audio.loop = true;
    audio.preload = "auto"; // ✅ 첫 화면이면 미리 로드 시도
    audioRef.current = audio;

    audio.play().catch(() => {
      // 자동재생 정책 때문에 실패할 수 있음 (특히 iOS)
    });

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        // 재생 실패 (정책/저전력 모드 등)
      }
    }
  };

  return (
    <div className="main-wrap">
      <img
        src={mainSvgUrl}
        alt="Main"
        className="main-img"
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />

      <button
        type="button"
        className="music-btn"
        onClick={toggleMusic}
        aria-label={isPlaying ? "음악 끄기" : "음악 켜기"}
      >
        <img
          src={isPlaying ? musicDefaultSvgUrl : musicStopSvgUrl}
          alt=""
          className="music-icon"
          loading="eager"
          decoding="async"
        />
      </button>
    </div>
  );
}
