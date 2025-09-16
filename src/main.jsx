import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import HeaderTabs from "./components/headerTabs";
import "./style/App.css";

const MainLayout = () => {
  const [activeTab, setActiveTab] = useState("กราฟ");

  return (
    <div>
      {/* Header */}
      <header className="app-header">
        <div className="header-left">
          <h2>ASRS Dashboard</h2>
        </div>
        {/* Use the existing HeaderTabs component */}
        <HeaderTabs onChange={setActiveTab} />
      </header>

      {/* App content */}
      <main>
        <App activeTab={activeTab} />
      </main>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MainLayout />
  </React.StrictMode>
);