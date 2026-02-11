import shareSvg from "../assets/Share.svg";

export default function ShareSection() {
  return (
    <div className="invitation">
      <img
        src={shareSvg}
        alt="Share"
        className="invitation-img"
        draggable={false}
      />
    </div>
  );
}
