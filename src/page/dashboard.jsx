import React, { useEffect, useState } from "react";
import FilterControls from "../components/filter";
import LogsChart from "../page/charts";
import { generateMockData } from "../services/mockData";

const stats = { total: 0, normal: 0, alarm: 0 };
const Dashboard = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);

  // Filters
  const [srm, setSrm] = useState("All");
  const [plcCode, setPlcCode] = useState("All");
  const [startDate, setStartDate] = useState("2025-09-01");
  const [endDate, setEndDate] = useState("2025-09-16");

  useEffect(() => {
    const data = generateMockData(300); // create mock logs
    setLogs(data);
    setFilteredLogs(data);
  }, []);

  // Mimic apply_filters from Python
  const handleApply = () => {
    let result = [...logs];

    if (srm !== "All") {
      result = result.filter((r) => String(r.ASRS) === String(srm));
    }
    if (plcCode !== "All") {
      result = result.filter((r) => String(r.PLCCODE) === String(plcCode));
    }
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      result = result.filter((r) => {
        const d = new Date(r.CDATE);
        return d >= start && d <= end;
      });
    }

    setFilteredLogs(result);
  };

  const handleClear = () => {
    setSrm("All");
    setPlcCode("All");
    setStartDate(null);
    setEndDate(null);
    setFilteredLogs(logs);
  };

  return (
    <div className="App">
      <h1>📊 ASRS Dashboard</h1>

      {/* Filter box */}
      <FilterControls
        srm={srm}
        setSrm={setSrm}
        plcCode={plcCode}
        setPlcCode={setPlcCode}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        onApply={handleApply}
        onClear={handleClear}
        stats={stats}
      />

      {/* Chart with filtered data */}
      <LogsChart data={filteredLogs} />
    </div>
  );
};

export default Dashboard;
