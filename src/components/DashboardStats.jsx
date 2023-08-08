import React from "react";

function DashboardStats({ forms, title, description }) {
  //   const getDescStyle = () => {
  //     if (description.includes("↗︎"))
  //       return "font-bold text-green-700 dark:text-green-300";
  //     else if (description.includes("↙"))
  //       return "font-bold text-rose-500 dark:text-red-400";
  //     else return "";
  //   };

  return (
    <div className="bg-white dark:bg-orange-600 shadow-md rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold text-gray-800 dark:text-white">
          {title} :
        </div>
        <div className={`text-xl dark:text-white`}>{forms}</div>
      </div>
      <div className="mt-2 text-gray-500 dark:text-gray-400">{description}</div>
    </div>
  );
}

export default DashboardStats;
