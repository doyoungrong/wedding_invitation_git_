import { useEffect, useRef, useState } from "react";

import mainSvg from "../assets/Main.svg";
import musicDefaultSvg from "../assets/Music_Default.svg";
import musicStopSvg from "../assets/Music_Stop.svg";
import bgm from "../assets/bgm.mp3";

export default function MainWithMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ✅ 기본은 "틀어져 있어야 함" (아이콘도 ON으로 시작)
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const audio = new Audio(bgm);
    audio.loop = true;
    audioRef.current = audio;

    // ✅ 기본 재생 "시도"
    audio
      .play()
      .then(() => {
        // 실제로 재생 성공했을 때만 ON 유지
        setIsPlaying(true);
      })
      .catch(() => {
        // ✅ 브라우저가 자동재생을 막으면 OFF 상태로 전환
        setIsPlaying(false);
      });

    // ✅ 백그라운드/잠금/탭 이동 시 자동 정지 + OFF 표시
    const handleVisibilityChange = () => {
      if (document.hidden) {
        audio.pause();
        setIsPlaying(false);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      audio.pause();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
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
        // 재생 실패(정책/저전력/무음 등)면 OFF 유지
        setIsPlaying(false);
      }
    }
  };

  return (
    <div className="main-wrap">
      <img src={mainSvg} alt="Main" className="main-img" />

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
        />
      </button>
    </div>
  );
}
