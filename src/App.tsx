import MainWithMusic from "./components/MainWithMusic";
import InvitationSvg from "./components/InvitationSvg";

export default function App() {
  return (
    <div className="page">
      {/* Main 섹션 */}
      <div className="invitation">
        <MainWithMusic />
      </div>

      {/* Invitation 섹션 */}
      <InvitationSvg />
    </div>
  );
}
