import React from "react";
import { Line } from "react-chartjs-2";

const DailyChart = ({ dailyData, calculateDailyAQI }) => {
  const chartData = {
    labels: dailyData?.map((entry) => entry.date?.local || "Unknown Date"),
    datasets: [
      {
        label: "AQI (Daily)",
        data: dailyData?.map((entry) => calculateDailyAQI(entry)),
        fill: false,
        borderColor: "rgb(255, 0, 0)",
        tension: 0.1,
      },
    ],
  };
  return <Line data={chartData} />;
};

export default DailyChart;
