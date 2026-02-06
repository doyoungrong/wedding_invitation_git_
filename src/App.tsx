import MainWithMusic from "./components/MainWithMusic";
import InvitationSvg from "./components/InvitationSvg";
import YoutubeSection from "./components/YoutubeSection";

export default function App() {
  return (
    <div className="page">
      {/* Main 섹션 */}
      <div className="invitation">
        <MainWithMusic />
      </div>

      {/* ✅ YouTube 섹션 (Main 바로 다음) */}
      <YoutubeSection videoId="TM_SaCao0bI" />

      {/* Invitation 섹션 */}
      <InvitationSvg />
    </div>
  );
}
