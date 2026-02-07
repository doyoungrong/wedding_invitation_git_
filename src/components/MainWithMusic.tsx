import { useEffect, useRef, useState } from "react";

import mainSvg from "../assets/Main.svg";
import musicDefaultSvg from "../assets/Music_Default.svg";
import musicStopSvg from "../assets/Music_Stop.svg";
import bgm from "../assets/bgm.mp3";

export default function MainWithMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false); // ✅ 기본 OFF

  useEffect(() => {
    const audio = new Audio(bgm);
    audio.loop = true;
    audioRef.current = audio;

    // ✅ 페이지가 백그라운드로 가면 자동 정지
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
        // ✅ 브라우저가 재생을 막으면 OFF 상태 유지
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
