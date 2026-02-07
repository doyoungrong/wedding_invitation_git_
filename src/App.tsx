import { useEffect } from "react";

import MainWithMusic from "./components/MainWithMusic";
import InvitationSvg from "./components/InvitationSvg";
import YoutubeSection from "./components/YoutubeSection";
import WeSection from "./components/WeSection";
import GallerySection from "./components/GallerySection";
import CalendarMapTitleSection from "./components/CalendarMapTitleSection";
import KakaoMapSection from "./components/KakaoMapSection";

export default function App() {
  useEffect(() => {
    // ✅ 뒤로가기/재방문 시 스크롤 위치 복원 방지
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // ✅ 항상 맨 위부터 시작
    window.scrollTo(0, 0);
    requestAnimationFrame(() => window.scrollTo(0, 0));
    setTimeout(() => window.scrollTo(0, 0), 50);

    // ✅ index.html에서 숨겨둔 화면 표시 (플래시 방지 핵심)
    document.documentElement.classList.remove("preload");
  }, []);

  return (
    <div className="page">
      <div className="invitation">
        <MainWithMusic />
      </div>

      <YoutubeSection videoId="TM_SaCao0bI" />

      <WeSection />

      <GallerySection />

      <CalendarMapTitleSection />
      <KakaoMapSection />

      <InvitationSvg />
    </div>
  );
}
