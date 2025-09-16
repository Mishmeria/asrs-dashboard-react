import React from "react";
import FilterControls from "../components/filter";
import LogsChart from "../page/charts";

const Dashboard = ({ filteredLogs, filterProps }) => {
  return (
    <div>
      {/* Filter Section */}
      <FilterControls {...filterProps} />

      {/* Chart Section */}
      <div style={{ marginTop: 20 }}>
        {filteredLogs.length > 0 ? (
          <LogsChart data={filteredLogs} />
        ) : (
          <div
            style={{
              height: 300,
              border: "1px solid #ddd",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#777",
            }}
          >
            No data available for the selected filters
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;