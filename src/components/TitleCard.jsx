import Subtitle from "./Subtitle";

function TitleCard({ title, children, topMargin, TopSideButtons }) {
  return (
    <div className={" " + (topMargin || "mt-6")}>
      {/* Title for Card */}
      <Subtitle styleClass={TopSideButtons ? "inline-block" : ""}>
        {title}

        {/* Top side button, show only if present */}
        {TopSideButtons && (
          <div className="inline-block float-right">{TopSideButtons}</div>
        )}
      </Subtitle>

      <div className="divider mt-2"></div>

      {/** Card Body */}
      <div className="h-[400px] w-[600px] pb-6 bg-base-100">{children}</div>
    </div>
  );
}

export default TitleCard;
