import React from "react";
import { Line } from "react-chartjs-2";

const HourlyChart = ({ hourlyData, calculateAQI }) => {
  const chartData = {
    labels: hourlyData?.map((entry) => entry.date.local),
    datasets: [
      {
        label: "AQI (Hourly)",
        data: hourlyData?.map((entry) => calculateAQI(entry.value)),
        fill: false,
        borderColor: "rgb(255, 0, 0)",
        tension: 0.1,
      },
    ],
  };

  return <Line data={chartData} />;
};

export default HourlyChart;
