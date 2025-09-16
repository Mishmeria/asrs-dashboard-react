import React, { useEffect, useState } from "react";
import { generateMockData } from "../services/mockData";
import "../style/beforeAlarm.css";

// Map alarm codes to descriptions
const Alarm_status_map = {
  101: "Motor overheating",
  102: "Position sensor failure",
  103: "Pallet misalignment",
  104: "Communication error",
  105: "Drive system error",
};

// Map normal PLCCODEs to description (example only)
const Normal_status_map = {
  1: "Idle",
  2: "Moving",
  5: "Loading",
  10: "Unloading",
  20: "Standby",
  30: "Ready",
  50: "Running",
  80: "Completed",
  90: "Finished",
};

const rowsPerPage = 10;

const BeforeAlarm = () => {
  const [logs, setLogs] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const data = generateMockData(300);
    setLogs(data);

    // split into alarm + normal
    const alarms = data.filter((r) => r.PLCCODE > 100).sort((a, b) => new Date(b.CDATE) - new Date(a.CDATE));
    const normals = data.filter((r) => r.PLCCODE < 100).sort((a, b) => new Date(a.CDATE) - new Date(b.CDATE));

    let beforeAlarmRows = [];

    alarms.forEach((alarm) => {
      const previousRows = normals.filter(
        (n) => n.ASRS === alarm.ASRS && new Date(n.CDATE) < new Date(alarm.CDATE)
      );
      if (previousRows.length > 0) {
        const lastNormal = previousRows[previousRows.length - 1];
        const durationSec = Math.floor(
          (new Date(alarm.CDATE) - new Date(lastNormal.CDATE)) / 1000
        );

        beforeAlarmRows.push({
          ASRS: lastNormal.ASRS,
          BARCODE: lastNormal.BARCODE,
          Level: lastNormal["Present_Level (D145)"] || "N/A",
          Bay: lastNormal["Present_Bay_Arm1 (D140)"] || "N/A",
          AlarmTime: new Date(alarm.CDATE).toLocaleString(),
          Alarm: alarm.PLCCODE,
          Detail: Alarm_status_map[alarm.PLCCODE] || "Unknown",
          CDATE: new Date(lastNormal.CDATE).toLocaleString(),
          PLCCODE: lastNormal.PLCCODE,
          Description: Normal_status_map[lastNormal.PLCCODE] || "Unknown",
          Duration: durationSec,
        });
      }
    });

    setTableData(beforeAlarmRows);
  }, []);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(tableData.length / rowsPerPage));
  const startIdx = currentPage * rowsPerPage;
  const endIdx = startIdx + rowsPerPage;
  const pageRows = tableData.slice(startIdx, endIdx);

  return (
    <div className="before-alarm-container">
      <h2>⚠️ เหตุการ์ณก่อนเกิด Alarm</h2>

      <div className="pagination-controls">
        <span>
          Page{" "}
          <select value={currentPage} onChange={(e) => setCurrentPage(Number(e.target.value))}>
            {Array.from({ length: totalPages }, (_, i) => (
              <option key={i} value={i}>
                {i + 1}
              </option>
            ))}
          </select>{" "}
          showing rows {startIdx + 1}–{Math.min(endIdx, tableData.length)} of {tableData.length}
        </span>
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
              <th>Duration (s)</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.length > 0 ? (
              pageRows.map((row, idx) => (
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
                  <td className="duration">{row.Duration}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" style={{ textAlign: "center" }}>
                  No pre-alarm data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BeforeAlarm;
