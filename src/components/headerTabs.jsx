import React, { useState } from "react";
import "../style/App.css";

const HeaderTabs = ({ onChange }) => {
  const [activeTab, setActiveTab] = useState("กราฟ");

  const tabs = ["กราฟ", "ก่อนเกิด Alarm", "สรุป Alarm", "รายละเอียด"];

  const handleClick = (tab) => {
    setActiveTab(tab);
    if (onChange) onChange(tab);
  };

  return (
    <nav className="header-tabs">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`header-tab ${activeTab === tab ? "active" : ""}`}
          onClick={() => handleClick(tab)}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
};

export default HeaderTabs;