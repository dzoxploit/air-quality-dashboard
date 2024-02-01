// components/MonthlyChart.js
import React from "react";
import { Line } from "react-chartjs-2";

const MonthlyChart = ({ monthlyData, calculateMonthlyAQI }) => {
  const chartData = {
    labels: monthlyData?.map((entry) => entry.date?.local || "Unknown Month"),
    datasets: [
      {
        label: "AQI (Monthly)",
        data: monthlyData?.map((entry) => calculateMonthlyAQI(entry)),
        fill: false,
        borderColor: "rgb(255, 0, 0)",
        tension: 0.1,
      },
    ],
  };

  return <Line data={chartData} />;
};

export default MonthlyChart;
