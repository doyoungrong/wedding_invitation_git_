import MainWithMusic from "./components/MainWithMusic";
import InvitationSvg from "./components/InvitationSvg";
import YoutubeSection from "./components/YoutubeSection";
import WeSection from "./components/WeSection";
import GallerySection from "./components/GallerySection";

// ✅ 추가
import CalendarMapTitleSection from "./components/CalendarMapTitleSection";
import KakaoMapSection from "./components/KakaoMapSection";
import MapSection from "./components/MapSection";

export default function App() {
  return (
    <div className="page">
      <div className="invitation">
        <MainWithMusic />
      </div>

      <YoutubeSection videoId="TM_SaCao0bI" />

      <WeSection />

      <GallerySection />

      {/* ✅ Gallery 와 KakaoMap 사이 */}
      <CalendarMapTitleSection />

      <KakaoMapSection />

      <MapSection />

      <InvitationSvg />
    </div>
  );
}
