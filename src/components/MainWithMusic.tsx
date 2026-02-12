import { useEffect, useRef, useState } from "react";

import mainDeco from "../assets/Main_Deco.svg";
import musicDefaultSvg from "../assets/Music_Default.svg";
import musicStopSvg from "../assets/Music_Stop.svg";
import bgm from "../assets/bgm.mp3";

export default function MainWithMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const initializedRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const audio = new Audio(bgm);
    audio.loop = true;
    audioRef.current = audio;

    audio.play().catch((e) => {
      // 자동재생 정책 때문에 실패할 수 있음 (특히 iOS)
      // e는 사용 안 해도 됨
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
      } catch (e) {
        // 재생 실패 (정책/저전력 모드 등)
      }
    }
  };

  return (
    <div className="main-wrap">
      {/* ✅ 배경 사진: public 경로로 (index.html preload와 동일) */}
      <img
        src="/img/Main_Photo.jpg"
        alt="Main Photo"
        className="main-photo"
        loading="eager"
        decoding="async"
        fetchPriority="high"
        draggable={false}
      />

      {/* ✅ 사진 위에 데코 SVG */}
      <img
        src={mainDeco}
        alt=""
        className="main-deco"
        loading="eager"
        decoding="async"
        draggable={false}
      />

      {/* ✅ 음악 버튼(그대로) */}
      <button
        type="button"
        className="music-btn"
        onClick={toggleMusic}
        aria-label={isPlaying ? "음악 끄기" : "음악 켜기"}
      >
        <img
          src={isPlaying ? musicDefaultSvg : musicStopSvg}
          alt=""
          className="music-icon"
          draggable={false}
        />
      </button>
    </div>
  );
}
