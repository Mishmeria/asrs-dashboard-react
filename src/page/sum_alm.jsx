import React, { useEffect, useState } from "react";
import Dropdown from "../components/dropdown";
import DatePicker from "../components/DatePicker";
import Button from "../components/button";
import { Alarm_status_map } from "../services/detailMap";
import "../style/alarmSummary.css";

const AlarmSummary = ({ data = [] }) => {
  const [alarmTable, setAlarmTable] = useState([]);
  const [lineSummary, setLineSummary] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  
  // Filter states
  const [srm, setSrm] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [alarmCode, setAlarmCode] = useState("All");

  // Get only alarm data (PLCCODE > 100)
  const getAlarmData = (sourceData) => {
    return sourceData.filter(item => item.PLCCODE > 100);
  };

  // Initialize with alarm data only
  useEffect(() => {
    const alarmData = getAlarmData(data);
    setFilteredData(alarmData);
  }, [data]);

  // Custom setter for SRM that applies filter immediately
  const handleSrmChange = (value) => {
    setSrm(value);
    applyFilters(value, alarmCode, startDate, endDate);
  };

  // Custom setter for alarm code that applies filter immediately
  const handleAlarmCodeChange = (value) => {
    setAlarmCode(value);
    applyFilters(srm, value, startDate, endDate);
  };

  // Custom setter for start date that applies filter immediately
  const handleStartDateChange = (value) => {
    setStartDate(value);
    applyFilters(srm, alarmCode, value, endDate);
  };

  // Custom setter for end date that applies filter immediately
  const handleEndDateChange = (value) => {
    setEndDate(value);
    applyFilters(srm, alarmCode, startDate, value);
  };

  // Apply filters to data
  const applyFilters = (srmValue = srm, alarmCodeValue = alarmCode, startDateValue = startDate, endDateValue = endDate) => {
    // Start with alarm logs only (PLCCODE > 100)
    let filtered = getAlarmData(data);
    
    // Filter by SRM
    if (srmValue !== "All") {
      filtered = filtered.filter(item => String(item.ASRS) === String(srmValue));
    }
    
    // Filter by alarm code
    if (alarmCodeValue !== "All") {
      filtered = filtered.filter(item => String(item.PLCCODE) === String(alarmCodeValue));
    }
    
    // Filter by date range
    if (startDateValue && endDateValue) {
      filtered = filtered.filter(item => {
        const rowDate = new Date(item.CDATE);
        const start = new Date(startDateValue);
        const end = new Date(endDateValue);
        
        // Set time to beginning/end of day for proper comparison
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        
        return rowDate >= start && rowDate <= end;
      });
    }
    
    setFilteredData(filtered);
  };

  // Clear all filters
  const clearFilters = () => {
    setSrm("All");
    setAlarmCode("All");
    setStartDate("");
    setEndDate("");
    setFilteredData(getAlarmData(data));
  };

  // Get unique SRM values for dropdown
  const getSrmOptions = () => {
    const alarmLogs = getAlarmData(data);
    const uniqueSrms = [...new Set(alarmLogs.map(item => item.ASRS))].sort();
    return ["All", ...uniqueSrms.map(String)];
  };

  // Get unique alarm codes for dropdown
  const getAlarmCodeOptions = () => {
    const alarmLogs = getAlarmData(data);
    const uniqueCodes = [...new Set(alarmLogs.map(item => item.PLCCODE))].sort((a, b) => a - b);
    return ["All", ...uniqueCodes.map(String)];
  };

  // Process data for tables whenever filtered data changes
  useEffect(() => {
    const alarmLogs = filteredData;
    
    if (alarmLogs.length === 0) {
      setAlarmTable([]);
      setLineSummary([]);
      return;
    }

    // --- Alarm frequency table (left)
    const alarmCounts = alarmLogs.reduce((acc, log) => {
      acc[log.PLCCODE] = (acc[log.PLCCODE] || 0) + 1;
      return acc;
    }, {});

    const alarmTableData = Object.entries(alarmCounts).map(([plccode, count]) => ({
      plccode: Number(plccode),
      count,
      percentage: (count / alarmLogs.length) * 100,
      description: Alarm_status_map[plccode] || "Unknown alarm",
    }));

    alarmTableData.sort((a, b) => b.count - a.count);
    setAlarmTable(alarmTableData);

    // --- Per-line summary table (right)
    const lineCounts = alarmLogs.reduce((acc, log) => {
      acc[log.ASRS] = (acc[log.ASRS] || 0) + 1;
      return acc;
    }, {});

    const lineSummaryData = Object.entries(lineCounts).map(([line, count]) => ({
      line: Number(line),
      count,
      percentage: (count / alarmLogs.length) * 100
    }));

    lineSummaryData.sort((a, b) => b.count - a.count);
    setLineSummary(lineSummaryData);
  }, [filteredData]);

  // Get total alarm count from original data
  const totalAlarmCount = getAlarmData(data).length;

  return (
    <div className="alarm-summary-container">
      <h2>📊 สถิติการเกิด Alarm</h2>
      
      {/* Filter Controls */}
      <div className="alarm-filter-section">
        <div className="filter-header">
          <h3>Filter Options</h3>
          <span className="filter-count">
            {filteredData.length} of {totalAlarmCount} alarm records
          </span>
        </div>
        
        <div className="filter-controls">
          <div className="filter-group">
            <Dropdown
              label="SRM"
              value={srm}
              options={getSrmOptions()}
              onChange={handleSrmChange}
            />
            <Dropdown
              label="Alarm Code"
              value={alarmCode}
              options={getAlarmCodeOptions()}
              onChange={handleAlarmCodeChange}
            />
          </div>
          
          <div className="filter-group">
            <DatePicker label="Start Date" value={startDate} onChange={handleStartDateChange} />
            <DatePicker label="End Date" value={endDate} onChange={handleEndDateChange} />
          </div>
          
          <div className="filter-actions">
            <Button text="Clear Filters" bgColor="orange" onClick={clearFilters} />
          </div>
        </div>
      </div>
      
      {data.length === 0 ? (
        <div className="no-data-message">
          <div className="no-data-icon">📊</div>
          <div className="no-data-text">No data available. Please generate new data.</div>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="no-data-message">
          <div className="no-data-icon">🔍</div>
          <div className="no-data-text">No alarm data found matching your filters.</div>
          <Button text="Reset Filters" bgColor="orange" onClick={clearFilters} />
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="alarm-summary-cards">
            <div className="summary-card total">
              <div className="card-value">{filteredData.length}</div>
              <div className="card-label">Total Alarms</div>
            </div>
            <div className="summary-card types">
              <div className="card-value">{alarmTable.length}</div>
              <div className="card-label">Unique Alarm Types</div>
            </div>
            <div className="summary-card lines">
              <div className="card-value">{lineSummary.length}</div>
              <div className="card-label">Affected SRM Lines</div>
            </div>
            <div className="summary-card top">
              <div className="card-value">
                {alarmTable.length > 0 ? `#${alarmTable[0].plccode}` : "N/A"}
              </div>
              <div className="card-label">Most Common Alarm</div>
            </div>
          </div>
        
          <div className="alarm-summary-grid">
            {/* Left: Alarm Frequency */}
            <div className="alarm-table">
              <h3>Alarm Frequency</h3>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>รหัส Alarm</th>
                      <th>จำนวนครั้ง</th>
                      <th>เปอร์เซ็นต์</th>
                      <th>รายละเอียด</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alarmTable.map((row, idx) => (
                      <tr key={idx}>
                        <td className="alarm-code">{row.plccode}</td>
                        <td>{row.count}</td>
                        <td>{row.percentage.toFixed(1)}%</td>
                        <td>{row.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right: Line Summary */}
            <div className="line-table">
              <h3>สรุปจำนวน Alarm แต่ละไลน์</h3>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>ASRS Line</th>
                      <th>Total Alarms</th>
                      <th>เปอร์เซ็นต์</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lineSummary.map((row, idx) => (
                      <tr key={idx}>
                        <td>{`SRM${row.line.toString().padStart(2, "0")}`}</td>
                        <td>{row.count}</td>
                        <td>{row.percentage.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AlarmSummary;