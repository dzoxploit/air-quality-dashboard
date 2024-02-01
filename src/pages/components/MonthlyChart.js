import React from "react";
import { Line } from "react-chartjs-2";

const MonthlyChart = ({ monthlyData, calculateMonthlyAQI }) => {
  // Check if monthlyData is available
  if (!monthlyData || monthlyData.length === 0) {
    return <p>No monthly data available.</p>;
  }

  const monthlyAggregatedData = monthlyData.reduce((result, entry) => {
    const month = entry.date?.substring(0, 7);
    if (!result[month]) {
      result[month] = {
        date: month,
        values: [],
      };
    }
    result[month].values.push(entry.value || 0);
    return result;
  }, {});

  // Calculate monthly averages
  const monthlyAverages = Object.values(monthlyAggregatedData).map((month) => ({
    date: month.date,
    value:
      month.values.reduce((sum, value) => sum + value, 0) / month.values.length,
  }));

  const chartData = {
    labels: monthlyAverages?.map((entry) => entry.date || "Unknown Month"),
    datasets: [
      {
        label: "AQI (Monthly)",
        data: monthlyAverages?.map((entry) => entry.value || 0),
        fill: false,
        borderColor: "rgb(255, 0, 0)",
        tension: 0.1,
      },
    ],
  };

  return <Line data={chartData} />;
};

export default MonthlyChart;
