import calendarMapTitleSvg from "../assets/Calendar&MapTitle.svg";

export default function CalendarMapTitleSection() {
  return (
    <div className="invitation">
      <img
        src={calendarMapTitleSvg}
        alt="Calendar and Map Title"
        className="invitation-img"
      />
    </div>
  );
}
