import React, { useEffect, useState } from "react";
import FilterControls from "../components/filter";
import LogsChart from "../page/charts";
import { generateMockData, filterData, calculateStats } from "../services/mockData";

const Dashboard = () => {
  // State for data
  const [allLogs, setAllLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [stats, setStats] = useState({ total: 0, normal: 0, alarm: 0 });

  // Filters
  const [srm, setSrm] = useState("All");
  const [msgType, setMsgType] = useState("All");
  const [plcCode, setPlcCode] = useState("All");
  const [startDate, setStartDate] = useState("2025-09-01");
  const [endDate, setEndDate] = useState("2025-09-16");

  // Generate initial data
  useEffect(() => {
    const mockDataResult = generateMockData(200, startDate, endDate);
    setAllLogs(mockDataResult.data);
    setFilteredLogs(mockDataResult.data);
    setStats(mockDataResult.stats);
  }, []);

  // Custom setter for SRM that applies filter immediately
  const handleSrmChange = (value) => {
    setSrm(value);
    applyFilters(value, msgType, plcCode);
  };

  // Custom setter for MSGTYPE that applies filter immediately
  const handleMsgTypeChange = (value) => {
    setMsgType(value);
    applyFilters(srm, value, plcCode);
  };

  // Custom setter for PLCCODE that applies filter immediately
  const handlePlcCodeChange = (value) => {
    setPlcCode(value);
    applyFilters(srm, msgType, value);
  };

  // Apply filters function
  const applyFilters = (srmValue = srm, msgTypeValue = msgType, plcCodeValue = plcCode) => {
    const filtered = filterData(allLogs, {
      srm: srmValue,
      msgType: msgTypeValue,
      plcCode: plcCodeValue,
      startDate,
      endDate
    });
    
    setFilteredLogs(filtered);
    setStats(calculateStats(filtered));
  };

  // Handle date apply - regenerate data for the selected date range
  const handleDateApply = () => {
    const mockDataResult = generateMockData(200, startDate, endDate);
    setAllLogs(mockDataResult.data);
    setFilteredLogs(mockDataResult.data);
    setStats(mockDataResult.stats);
    
    // Reset filters
    setSrm("All");
    setMsgType("All");
    setPlcCode("All");
  };

  // Clear all filters
  const handleClear = () => {
    setSrm("All");
    setMsgType("All");
    setPlcCode("All");
    setFilteredLogs(allLogs);
    setStats(calculateStats(allLogs));
  };

  // Export data to CSV
  const handleExport = () => {
    if (filteredLogs.length === 0) {
      alert("No data to export");
      return;
    }
    
    // Create CSV content
    const headers = ["ID", "ASRS", "PLCCODE", "MSGTYPE", "MSGLOG", "DATE", "TIME"];
    const csvContent = [
      headers.join(","),
      ...filteredLogs.map(log => [
        log.id,
        log.ASRS,
        log.PLCCODE,
        log.MSGTYPE,
        `"${log.MSGLOG.replace(/"/g, '""')}"`, // Handle quotes in text
        log.CDATE,
        log.CTIME
      ].join(","))
    ].join("\n");
    
    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `asrs_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      {/* Filter Section */}
      <FilterControls
        srm={srm}
        setSrm={handleSrmChange}
        msgType={msgType}
        setMsgType={handleMsgTypeChange}
        plcCode={plcCode}
        setPlcCode={handlePlcCodeChange}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        onDateApply={handleDateApply}
        onExport={handleExport}
        onClear={handleClear}
        stats={stats}
      />

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