import React from "react";
import Dashboard from "./page/dashboard";

const App = ({ activeTab }) => {
  return (
    <div className="App">
      {activeTab === "กราฟ" && <Dashboard />}
      {activeTab === "ก่อนเกิด Alarm" && <p>⚠️ Before Alarm content</p>}
      {activeTab === "สรุป Alarm" && <p>📊 Alarm Summary content</p>}
      {activeTab === "รายละเอียด" && <p>📜 Detail content</p>}
    </div>
  );
};

export default App;
