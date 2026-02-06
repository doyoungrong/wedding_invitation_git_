import MainWithMusic from "./components/MainWithMusic";
import InvitationSvg from "./components/InvitationSvg";
import YoutubeSection from "./components/YoutubeSection";
import WeSection from "./components/WeSection";

export default function App() {
  return (
    <div className="page">
      {/* Main 섹션 */}
      <div className="invitation">
        <MainWithMusic />
      </div>

      {/* YouTube 섹션 */}
      <YoutubeSection videoId="TM_SaCao0bI" />

      {/* ✅ We 섹션 (영상 바로 아래) */}
      <WeSection />

      {/* Invitation 섹션 */}
      <InvitationSvg />
    </div>
  );
}
