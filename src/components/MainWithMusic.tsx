import { useEffect, useRef, useState } from "react";

import mainSvg from "../assets/Main.svg";
import musicDefaultSvg from "../assets/Music_Default.svg";
import musicStopSvg from "../assets/Music_Stop.svg";
import bgm from "../assets/bgm.mp3";

export default function MainWithMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  // 1) 페이지 열리면 자동재생 시도
  useEffect(() => {
    const audio = new Audio(bgm);
    audio.loop = true;
    audioRef.current = audio;

    // 모바일(특히 iOS) 정책상 자동재생이 막힐 수 있음 -> 실패해도 상태는 유지
    audio.play().catch(() => {
      // 자동재생이 막히면, 첫 클릭 때 재생되게 하면 됨
      // (요구사항은 "기본 재생"이지만 브라우저 정책 때문에 예외가 생길 수 있어)
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
        // 자동재생/재생 실패 시 (정책/저전력 모드 등)
      }
    }
  };

  return (
    <div className="main-wrap">
      <img src={mainSvg} alt="Main" className="main-img" />

      {/* Main.svg 위에 얹는 음악 버튼 */}
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
