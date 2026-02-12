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
        // 재생 실패 (정
