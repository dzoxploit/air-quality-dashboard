// components/DetailPopup.js
import React from "react";

const DetailPopup = ({ data }) => {
  return (
    <div>
      <h3>Measurement Detail</h3>
      <p>Date: {data?.date?.local || "N/A"}</p>
      <p>Value: {data?.value || "N/A"} ug/m³</p>
      {/* Add more details as needed */}
    </div>
  );
};

export default DetailPopup;
