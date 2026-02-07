import MainWithMusic from "./components/MainWithMusic";
import InvitationSvg from "./components/InvitationSvg";
import YoutubeSection from "./components/YoutubeSection";
import WeSection from "./components/WeSection";
import GallerySection from "./components/GallerySection";
import CalendarMapTitleSection from "./components/CalendarMapTitleSection";
import KakaoMapSection from "./components/KakaoMapSection"; 

export default function App() {
  return (
    <div className="page">
      <div className="invitation">
        <MainWithMusic />
      </div>

      <YoutubeSection videoId="TM_SaCao0bI" />

      <WeSection />

      <GallerySection />

      {/* ✅ 갤러리 바로 아래 */}
      <CalendarMapTitleSection />

      {/* ✅ Calendar & Map Title 바로 아래: 카카오 지도 */}
      <KakaoMapSection />

      <InvitationSvg />
    </div>
  );
}
