import React, { useEffect, useState } from "react";
import { Normal_status_map, Alarm_status_map } from "../services/detailMap";
import "../style/beforeAlarm.css";

const rowsPerPage = 10;

const BeforeAlarm = ({ data = [] }) => {
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  // Initialize with data
  useEffect(() => {
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

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
  const startIdx = currentPage * rowsPerPage;
  const endIdx = startIdx + rowsPerPage;
  const pageRows = filteredData.slice(startIdx, endIdx);

  return (
    <div className="before-alarm-container">
      <h2>⚠️ เหตุการ์ณก่อนเกิด Alarm</h2>
      
      {filteredData.length === 0 ? (
        <div className="no-data-message">
          <div className="no-data-icon">🔍</div>
          <div className="no-data-text">No pre-alarm data found.</div>
        </div>
      ) : (
        <>
          <div className="pagination-row">
            <div className="pagination-info">
              Showing {startIdx + 1}–{Math.min(endIdx, filteredData.length)} of {filteredData.length} records
            </div>
            <div className="pagination-controls">
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

          <div className="table-container">
            <table className="before-alarm-table">
              <thead>
                <tr>
                  <th>ASRS</th>
                  <th>BARCODE</th>
                  <th>LEVEL</th>
                  <th>BAY</th>
                  <th>ALARMTIME</th>
                  <th>ALARM</th>
                  <th>DETAIL</th>
                  <th>LAST STATUS TIME</th>
                  <th>PLCCODE</th>
                  <th>DESCRIPTION</th>
                  <th>DURATION</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row, idx) => (
                  <tr key={idx}>
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