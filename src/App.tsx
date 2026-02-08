import MainWithMusic from "./components/MainWithMusic";
import InvitationSvg from "./components/InvitationSvg";
import YoutubeSection from "./components/YoutubeSection";
import WeSection from "./components/WeSection";
import GallerySection from "./components/GallerySection";

// ✅ 추가
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

      {/* ✅ 카카오맵 */}
      <KakaoMapSection />

      {/* ✅ 카카오맵 바로 아래에 Map.svg */}
      <MapSection />

      <InvitationSvg />
    </div>
  );
}
