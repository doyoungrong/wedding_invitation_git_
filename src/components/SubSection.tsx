import subSvg from "../assets/Sub.svg";

export default function SubSection() {
  return (
    <div className="invitation">
      <img
        src={subSvg}
        alt="Sub"
        className="invitation-img"
        draggable={false}
      />
    </div>
  );
}
