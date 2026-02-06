import MainWithMusic from "./components/MainWithMusic";
import InvitationSvg from "./components/InvitationSvg";
import YoutubeSection from "./components/YoutubeSection";
import WeSection from "./components/WeSection";
import GallerySection from "./components/GallerySection";

export default function App() {
  return (
    <div className="page">
      <div className="invitation">
        <MainWithMusic />
      </div>

      <YoutubeSection videoId="TM_SaCao0bI" />

      <WeSection />

      {/* ✅ We.svg 바로 다음: 갤러리 */}
      <GallerySection />

      <InvitationSvg />
    </div>
  );
}
