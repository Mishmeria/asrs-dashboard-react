import React, { useEffect, useState } from "react";
import Dropdown from "../components/dropdown";
import DatePicker from "../components/DatePicker";
import Button from "../components/button";
import { Normal_status_map, Alarm_status_map } from "../services/detailMap";
import "../style/beforeAlarm.css";

const rowsPerPage = 10;

const BeforeAlarm = ({ data = [] }) => {
  const [logs, setLogs] = useState(data);
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  
  // Filter states
  const [srm, setSrm] = useState("All");
  const [alarmCode, setAlarmCode] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [durationFilter, setDurationFilter] = useState("All");

  // Initialize with data
  useEffect(() => {
    setLogs(data);
    processData(data);
  }, [data]);

  // Process data to find events before alarms
  const processData = (sourceData) => {
    // Split into alarm + normal
    const alarms = sourceData.filter((r) => r.PLCCODE > 100).sort((a, b) => new Date(b.CDATE + ' ' + b.CTIME) - new Date(a.CDATE + ' ' + a.CTIME));
    const normals = sourceData.filter((r) => r.PLCCODE <= 100).sort((a, b) => new Date(a.CDATE + ' ' + a.CTIME) - new Date(b.CDATE + ' ' + b.CTIME));

    let beforeAlarmRows = [];

    alarms.forEach((alarm) => {
      const previousRows = normals.filter(
        (n) => n.ASRS === alarm.ASRS && new Date(n.CDATE + ' ' + n.CTIME) < new Date(alarm.CDATE + ' ' + alarm.CTIME)
      );
      
      if (previousRows.length > 0) {
        const lastNormal = previousRows[previousRows.length - 1];
        const durationSec = Math.floor(
          (new Date(alarm.CDATE + ' ' + alarm.CTIME) - new Date(lastNormal.CDATE + ' ' + lastNormal.CTIME)) / 1000
        );

        beforeAlarmRows.push({
          ASRS: lastNormal.ASRS,
          BARCODE: lastNormal.BARCODE || "N/A",
          Level: lastNormal["Present_Level"] || "N/A",
          Bay: lastNormal["Present_Bay"] || "N/A",
          AlarmTime: `${alarm.CDATE} ${alarm.CTIME}`,
          Alarm: alarm.PLCCODE,
          Detail: Alarm_status_map[alarm.PLCCODE] || "Unknown",
          CDATE: `${lastNormal.CDATE} ${lastNormal.CTIME}`,
          PLCCODE: lastNormal.PLCCODE,
          Description: Normal_status_map[lastNormal.PLCCODE] || "Unknown",
          Duration: durationSec,
        });
      }
    });

    setTableData(beforeAlarmRows);
    setFilteredData(beforeAlarmRows);
  };

  // Custom setter for SRM that applies filter immediately
  const handleSrmChange = (value) => {
    setSrm(value);
    applyFilters(value, alarmCode, startDate, endDate, durationFilter);
  };

  // Custom setter for alarm code that applies filter immediately
  const handleAlarmCodeChange = (value) => {
    setAlarmCode(value);
    applyFilters(srm, value, startDate, endDate, durationFilter);
  };

  // Custom setter for start date that applies filter immediately
  const handleStartDateChange = (value) => {
    setStartDate(value);
    applyFilters(srm, alarmCode, value, endDate, durationFilter);
  };

  // Custom setter for end date that applies filter immediately
  const handleEndDateChange = (value) => {
    setEndDate(value);
    applyFilters(srm, alarmCode, startDate, value, durationFilter);
  };

  // Custom setter for duration filter that applies filter immediately
  const handleDurationChange = (value) => {
    setDurationFilter(value);
    applyFilters(srm, alarmCode, startDate, endDate, value);
  };

  // Apply filters to data
  const applyFilters = (
    srmValue = srm, 
    alarmCodeValue = alarmCode, 
    startDateValue = startDate, 
    endDateValue = endDate,
    durationValue = durationFilter
  ) => {
    let filtered = [...tableData];
    
    // Filter by SRM
    if (srmValue !== "All") {
      filtered = filtered.filter(item => String(item.ASRS) === String(srmValue));
    }
    
    // Filter by alarm code
    if (alarmCodeValue !== "All") {
      filtered = filtered.filter(item => String(item.Alarm) === String(alarmCodeValue));
    }
    
    // Filter by date range (using alarm time)
    if (startDateValue && endDateValue) {
      filtered = filtered.filter(item => {
        const alarmDate = new Date(item.AlarmTime);
        const start = new Date(startDateValue);
        const end = new Date(endDateValue);
        
        // Set time to beginning/end of day for proper comparison
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        
        return alarmDate >= start && alarmDate <= end;
      });
    }
    
    // Filter by duration
    if (durationValue !== "All") {
      switch(durationValue) {
        case "short":
          filtered = filtered.filter(item => item.Duration < 60); // Less than 1 minute
          break;
        case "medium":
          filtered = filtered.filter(item => item.Duration >= 60 && item.Duration < 300); // 1-5 minutes
          break;
        case "long":
          filtered = filtered.filter(item => item.Duration >= 300); // 5+ minutes
          break;
        default:
          break;
      }
    }
    
    setFilteredData(filtered);
    setCurrentPage(0); // Reset to first page when filters change
  };

  // Clear all filters
  const clearFilters = () => {
    setSrm("All");
    setAlarmCode("All");
    setStartDate("");
    setEndDate("");
    setDurationFilter("All");
    setFilteredData(tableData);
    setCurrentPage(0);
  };

  // Get unique SRM values for dropdown
  const getSrmOptions = () => {
    const uniqueSrms = [...new Set(tableData.map(item => item.ASRS))].sort();
    return ["All", ...uniqueSrms.map(String)];
  };

  // Get unique alarm codes for dropdown
  const getAlarmCodeOptions = () => {
    const uniqueCodes = [...new Set(tableData.map(item => item.Alarm))].sort((a, b) => a - b);
    return ["All", ...uniqueCodes.map(String)];
  };

  // Format duration for display
  const formatDuration = (seconds) => {
    if (seconds < 60) {
      return `${seconds} วินาที`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes} นาที ${remainingSeconds} วินาที`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours} ชั่วโมง ${minutes} นาที`;
    }
  };

  // Duration filter options
  const durationOptions = ["All", "short", "medium", "long"];
  const durationLabels = {
    "All": "All",
    "short": "< 1 นาที",
    "medium": "1-5 นาที",
    "long": "> 5 นาที"
  };

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
  const startIdx = currentPage * rowsPerPage;
  const endIdx = startIdx + rowsPerPage;
  const pageRows = filteredData.slice(startIdx, endIdx);

  return (
    <div className="before-alarm-container">
      <h2>⚠️ เหตุการ์ณก่อนเกิด Alarm</h2>
      
      {/* Filter Controls */}
      <div className="alarm-filter-section">
        <div className="filter-header">
          <h3>Filter Options</h3>
          <span className="filter-count">
            {filteredData.length} of {tableData.length} records
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
            <Dropdown
              label="Duration"
              value={durationFilter}
              options={durationOptions}
              optionLabels={durationLabels}
              onChange={handleDurationChange}
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

      {filteredData.length === 0 ? (
        <div className="no-data-message">
          <div className="no-data-icon">🔍</div>
          <div className="no-data-text">No pre-alarm data found matching your filters.</div>
          {tableData.length > 0 && (
            <Button text="Reset Filters" bgColor="orange" onClick={clearFilters} />
          )}
        </div>
      ) : (
        <>
          <div className="pagination-controls">
            <div className="pagination-info">
              Showing {startIdx + 1}–{Math.min(endIdx, filteredData.length)} of {filteredData.length} records
            </div>
            <div className="pagination-buttons">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))} 
                disabled={currentPage === 0}
                className="pagination-button"
              >
                &lt; Previous
              </button>
              <select
                value={currentPage}
                onChange={(e) => setCurrentPage(Number(e.target.value))}
                className="pagination-select"
              >
                {Array.from({ length: totalPages }, (_, i) => (
                  <option key={i} value={i}>
                    Page {i + 1} of {totalPages}
                  </option>
                ))}
              </select>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))} 
                disabled={currentPage >= totalPages - 1}
                className="pagination-button"
              >
                Next &gt;
              </button>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="before-alarm-table">
              <thead>
                <tr>
                  <th>ASRS</th>
                  <th>BARCODE</th>
                  <th>Level</th>
                  <th>Bay</th>
                  <th>AlarmTime</th>
                  <th>Alarm</th>
                  <th>Detail</th>
                  <th>Last Status Time</th>
                  <th>PLCCODE</th>
                  <th>Description</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row, idx) => (
                  <tr key={idx} className="alarm-row">
                    <td>{row.ASRS}</td>
                    <td>{row.BARCODE}</td>
                    <td>{row.Level}</td>
                    <td>{row.Bay}</td>
                    <td>{row.AlarmTime}</td>
                    <td className="alarm-code">{row.Alarm}</td>
                    <td>{row.Detail}</td>
                    <td>{row.CDATE}</td>
                    <td>{row.PLCCODE}</td>
                    <td>{row.Description}</td>
                    <td className="duration">{formatDuration(row.Duration)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default BeforeAlarm;