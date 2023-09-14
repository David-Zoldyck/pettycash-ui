import { useState } from "react";

export const ThumbNail = ({ imageUrl }) => {
  const [showFull, setShowFull] = useState(false);
  return (
    <div className="flex flex-col">
      <div>
        <strong>Attachments: </strong>
        <img
          title={`Double click to ${showFull ? "revert" : "enlarge"}`}
          onDoubleClick={() => setShowFull((val) => !val)}
          src={imageUrl}
          alt="Attachment"
          className={`${
            showFull ? "max-w-full" : "w-1/4"
          } h-auto hover:shadow hover:cursor-pointer hover:border-blue-600 border`}
        />
      </div>
    </div>
  );
};
