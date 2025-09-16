import React from "react";

const DateChip = ({ label, value, onClick }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 14, fontWeight: 500 }}>
        {label}: {value || "Select"}
      </span>
      <button
        onClick={onClick}
        style={{
          border: "none",
          background: "transparent",
          cursor: "pointer",
        }}
      >
        📅
      </button>
    </div>
  );
};

export default DateChip;
