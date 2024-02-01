import React from "react";
import { Line } from "react-chartjs-2";

const DailyChart = ({ dailyData, calculateDailyAQI }) => {
  // Check if dailyData is available
  if (!dailyData || dailyData.length === 0) {
    return <p>No daily data available.</p>;
  }

  // Assuming your data is named 'groupedData'
  const flattenedData = dailyData.flat();

  // Convert hourly data to daily data
  const dailyAggregatedData = flattenedData.reduce((result, entry) => {
    const date = entry.date?.local.split("T")[0];
    if (!result[date]) {
      result[date] = {
        date: date,
        values: [],
      };
    }
    result[date].values.push(entry.value || 0);
    return result;
  }, {});

  // Calculate daily averages
  const dailyAverages = Object.values(dailyAggregatedData).map((day) => ({
    date: day.date,
    value:
      day.values.reduce((sum, value) => sum + value, 0) / day.values.length,
  }));

  const chartData = {
    labels: dailyAverages?.map((entry) => entry.date || "Unknown Date"),
    datasets: [
      {
        label: "AQI (Daily)",
        data: dailyAverages?.map((entry) => entry.value || 0),
        fill: false,
        borderColor: "rgb(255, 0, 0)",
        tension: 0.1,
      },
    ],
  };

  return <Line data={chartData} />;
};

export default DailyChart;
