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

    // ✅ 처음 로드/새로고침 시 무조건 맨 위부터 보이게
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
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
