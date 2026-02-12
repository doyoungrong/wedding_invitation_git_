import parentsSvg from "../assets/Parents.svg";

export default function ParentsSection() {
  return (
    <div className="invitation">
      <img
        src={parentsSvg}
        alt="Parents"
        className="invitation-img"
        draggable={false}
      />
    </div>
  );
}
