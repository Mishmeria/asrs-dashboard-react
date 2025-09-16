import React from "react";

const colorMap = {
  blue: { text: "#1565c0", bg: "#e3f2fd" },
  green: { text: "#2e7d32", bg: "#e8f5e9" },
  orange: { text: "#ef6c00", bg: "#fff3e0" },
};

const SummaryCard = ({ title, value, color = "blue" }) => {
  const { text, bg } = colorMap[color] || colorMap.blue;

  return (
    <div
      style={{
        width: 200,
        height: 100,
        backgroundColor: bg,
        borderRadius: 8,
        padding: 10,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <span style={{ fontSize: 16, fontWeight: "bold", color: text }}>
        {title}
      </span>
      <span style={{ fontSize: 24, fontWeight: "bold" }}>{value}</span>
    </div>
  );
};

export default SummaryCard;
