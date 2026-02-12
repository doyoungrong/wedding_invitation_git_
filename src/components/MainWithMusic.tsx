import { useEffect, useRef, useState } from "react";

import mainPhoto from "../assets/Main_Photo.jpg";
import mainDeco from "../assets/Main_Deco.svg";

import musicDefaultSvg from "../assets/Music_Default.svg";
import musicStopSvg from "../assets/Music_Stop.svg";
import bgm from "../assets/bgm.mp3";

export default function MainWithMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const initializedRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    // ✅ StrictMode(개발)에서 2번 실행 방지
    if (initializedRef.current) return;
    initializedRef.current = true;

    const audio = new Audio(bgm);
    audio.loop = true;
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
      {/* ✅ 배경 사진 */}
      <img
        src={mainPhoto}
        alt="Main Photo"
        className="main-photo"
        loading="eager"
        decoding="async"
        fetchPriority="high"
        draggable={false}
      />

      {/* ✅ 사진 위에 데코 SVG (위에서 130px 아래부터 시작) */}
      <img
        src={mainDeco}
        alt=""
        className="main-deco"
        loading="eager"
        decoding="async"
        draggable={false}
      />

      {/* ✅ 음악 버튼(기존 그대로) */}
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
