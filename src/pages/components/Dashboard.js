// components/Dashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2"; // Fix: Import Line as a named import
import Chart from "chart.js/auto";
import "chart.js";
import HourlyChart from "./HourlyChart";
import DailyChart from "./DailyChart";
import MonthlyChart from "./MonthlyChart";
import DetailPopup from "./DetailPopup";
import styles from "../../styles/styles.module.css";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [dailyData, setDailyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [updateInterval, setUpdateInterval] = useState(300000); // 5 minutes in milliseconds
  const [updating, setUpdating] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(1628560);
  const [error, setError] = useState(null);

  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  const handleLocationSubmit = () => {
    fetchData(selectedLocation);
  };

  const fetchData = async (locationId) => {
    try {
      setUpdating(true);
      const response = await axios.get(
        "https://api.openaq.org/v2/measurements",
        {
          params: {
            location_id: locationId,
            parameter: "pm25",
            date_from: "2024-01-31T14:32:55+07:00",
            date_to: "2024-02-01T14:32:55+07:00",
            limit: 1000,
          },
        }
      );
      const rawData = response.data.results;
      setData(rawData);
      setDailyData(groupDataByDay(rawData));
      setMonthlyData(groupDataByMonth(rawData));
      setUpdating(false);
      setError(null);
    } catch (error) {
      console.error("Error fetching data:", error);
      setUpdating(false);
    }
  };

  const startAutoUpdate = () => {
    const intervalId = setInterval(
      () => fetchData(selectedLocation),
      updateInterval
    );
    return () => clearInterval(intervalId);
  };

  useEffect(() => {
    fetchData(selectedLocation);
    const autoUpdateCleanup = startAutoUpdate();
    return () => autoUpdateCleanup();
  }, [selectedLocation]);

  const calculateAQI = (pm25Value) => {
    // Implement your AQI calculation logic here
    // Refer to the provided reference for the calculation formula
    // Return the calculated AQI value
    // You can implement separate functions for hourly, daily, and monthly AQI calculations
    return pm25Value; // Replace with actual AQI calculation
  };

  // Function to calculate Daily AQI
  const calculateDailyAQI = (dailyData) => {
    // Implement your daily AQI calculation logic here
    // You may use the average PM2.5 value for the day
    // Return the calculated daily AQI value
    return calculateAQI(
      dailyData.reduce((sum, entry) => sum + entry.value, 0) / dailyData.length
    );
  };

  // Function to calculate Monthly AQI
  const calculateMonthlyAQI = (monthlyData) => {
    // Implement your monthly AQI calculation logic here
    // You may use the average PM2.5 value for the month
    // Return the calculated monthly AQI value
    return calculateAQI(
      monthlyData.reduce((sum, entry) => sum + entry.value, 0) /
        monthlyData.length
    );
  };

  const hourlyData = data?.slice(0, 24);

  const chartData = {
    labels: data?.map((entry) => entry.date.local),
    datasets: [
      {
        label: "PM2.5 (ug/m3)",
        data: data?.map((entry) => entry.value),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const aqiChartData = {
    labels: data?.map((entry) => entry.date.local),
    datasets: [
      {
        label: "AQI",
        data: data?.map((entry) => calculateAQI(entry.value)),
        fill: false,
        borderColor: "rgb(255, 0, 0)",
        tension: 0.1,
      },
    ],
  };

  const groupDataByDay = (data) => {
    const groupedData = data.reduce((result, entry) => {
      const date = entry.date.local.split("T")[0];
      if (!result[date]) {
        result[date] = [];
      }
      result[date].push(entry);
      return result;
    }, {});
    return Object.values(groupedData);
  };

  const groupDataByMonth = (data) => {
    const groupedData = data.reduce((result, entry) => {
      const month = entry.date.local.substring(0, 7);
      if (!result[month]) {
        result[month] = [];
      }
      result[month].push(entry);
      return result;
    }, {});
    return Object.values(groupedData);
  };

  const getAQICategory = (aqiValue) => {
    // Implement logic to categorize AQI value into categories
    if (aqiValue <= 50) {
      return "Good";
    } else if (aqiValue <= 100) {
      return "Moderate";
    } else if (aqiValue <= 150) {
      return "Unhealthy for Sensitive Groups";
    } else if (aqiValue <= 200) {
      return "Unhealthy";
    } else if (aqiValue <= 300) {
      return "Very Unhealthy";
    } else {
      return "Hazardous";
    }
  };
  const handlePointClick = (event, elements) => {
    if (elements.length > 0) {
      // Get the selected data point
      const selectedIndex = elements[0].index;
      const selectedDataPoint = data[selectedIndex];

      // Update selectedData state
      setSelectedData(selectedDataPoint);
    }
  };

  return (
    <div className={`${styles.container} bg-gray-100 p-6`}>
      <h1 className="text-2xl font-bold mb-4">Air Quality Dashboard</h1>

      {/* Location Selection Form */}
      <div className="location-form">
        <label htmlFor="location" className="mr-2">
          Select Location:
        </label>
        <select
          id="location"
          value={selectedLocation}
          onChange={handleLocationChange}
          className="mr-2"
        >
          <option value={1628560}>Location 1</option>
          {/* Add more location options as needed */}
        </select>
        <button
          onClick={handleLocationSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Change Location
        </button>
      </div>

      {data ? (
        <>
          <Line
            data={chartData}
            options={{
              onClick: handlePointClick,
            }}
          />
          <Line data={aqiChartData} />
          <HourlyChart hourlyData={hourlyData} calculateAQI={calculateAQI} />
          <DailyChart
            dailyData={dailyData}
            calculateDailyAQI={calculateDailyAQI}
          />
          <MonthlyChart
            monthlyData={monthlyData}
            calculateMonthlyAQI={calculateMonthlyAQI}
          />

          {/* Display AQI categories */}
          <div>
            <h2>AQI Categories</h2>
            <p>
              Hourly AQI Category:{" "}
              {getAQICategory(calculateAQI(hourlyData[0]?.value))}
            </p>
            <p>
              Daily AQI Category:{" "}
              {getAQICategory(calculateDailyAQI(dailyData[0]))}
            </p>
            <p>
              Monthly AQI Category:{" "}
              {getAQICategory(calculateMonthlyAQI(monthlyData[0]))}
            </p>
          </div>

          {/* Display Detail Popup */}
          {selectedData && (
            <div className={styles.detailPopup}>
              <DetailPopup data={selectedData} />
            </div>
          )}

          {/* Display Update Status */}
          {updating && <p className="text-blue-500">Updating data...</p>}
        </>
      ) : (
        <>
          {error ? (
            <p className="error-message">Error: {error}</p>
          ) : (
            <p>Loading...</p>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
