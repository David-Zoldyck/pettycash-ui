import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import TitleCard from "./TitleCard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function BarChart({ totalForms, approvedForms, rejectedForms }) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  // const mappedStats = stats.map((stat) => {
  //   return <div></div>;
  // });

  const labels = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "PettyCash Forms",
        data: labels.map(() => {
          return Math.random() * 1000 + 500;
        }),
        backgroundColor: "rgba(204, 85, 0, 1)",
      },
      // {
      //   label: "Store 2",
      //   data: labels.map(() => {
      //     return Math.random() * 1000 + 500;
      //   }),
      //   backgroundColor: "rgba(53, 162, 235, 1)",
      // },
    ],
  };

  return (
    <TitleCard title={"No of Orders"} topMargin="mt-2">
      <Bar options={options} data={data} />
    </TitleCard>
  );
}

export default BarChart;
