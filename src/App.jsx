import React, { useState, useEffect } from "react";
import Dashboard from "./page/dashboard";
import Detail from "./page/detail";
import AlarmSummary from "./page/sum_alm";
import BeforeAlarm from "./page/almAnalys";
import { generateMockData, filterData, calculateStats } from "./services/mockData";
import FilterControls from "./components/filter";

const App = ({ activeTab }) => {
  // Shared state for data across tabs
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

  // Common filter controls props
  const filterProps = {
    srm,
    setSrm: handleSrmChange,
    msgType,
    setMsgType: handleMsgTypeChange,
    plcCode,
    setPlcCode: handlePlcCodeChange,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    onDateApply: handleDateApply,
    onExport: handleExport,
    onClear: handleClear,
    stats
  };

  // Get dynamic PLCCODE options based on current data
  const getPlcCodeOptions = () => {
    const uniqueCodes = [...new Set(allLogs.map(item => item.PLCCODE))].sort((a, b) => a - b);
    return ["All", ...uniqueCodes.map(String)];
  };

  // Update filter props with dynamic options
  const enhancedFilterProps = {
    ...filterProps,
    plcCodeOptions: getPlcCodeOptions()
  };

  return (
    <div className="App">
      {/* Common Filter Controls for all tabs */}
      <div className="global-filter-container">
        <FilterControls {...enhancedFilterProps} />
      </div>

      {activeTab === "กราฟ" && (
        <Dashboard 
          filteredLogs={filteredLogs} 
        />
      )}
      {activeTab === "ก่อนเกิด Alarm" && (
        <BeforeAlarm data={allLogs} />
      )}
      {activeTab === "สรุป Alarm" && (
        <AlarmSummary data={filteredLogs} />
      )}
      {activeTab === "รายละเอียด" && (
        <Detail data={filteredLogs} />
      )}
    </div>
  );
};

export default App;