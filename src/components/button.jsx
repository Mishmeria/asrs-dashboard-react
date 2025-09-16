import React from "react";

const Button = ({ text, icon, onClick, bgColor, color, height = 40 }) => {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: bgColor || "#1976d2",
        color: color || "white",
        height,
        padding: "0 12px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
      }}
    >
      {icon && <span style={{ marginRight: 6 }}>{icon}</span>}
      {text}
    </button>
  );
};

export default Button;
