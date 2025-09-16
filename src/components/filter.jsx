import React from "react";
import "../style/filter.css";

const FilterControls = ({
  srm,
  setSrm,
  msgType,
  setMsgType,
  plcCode,
  setPlcCode,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onDateApply,
  onExport,
  onClear,
  stats,
  plcCodeOptions = ["All", "101", "102", "103"] // Default options if not provided
}) => {
  return (
    <div className="filter-controls-container">
      <div className="filter-controls-row">
        {/* SRM Filter */}
        <div className="filter-group">
          <div className="filter-label">SRM</div>
          <select
            value={srm}
            onChange={(e) => setSrm(e.target.value)}
            className="filter-select"
          >
            <option value="All">All</option>
            {["1", "2", "3", "4", "5", "6", "7", "8"].map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* MSGTYPE Filter */}
        <div className="filter-group">
          <div className="filter-label">MSGTYPE</div>
          <select
            value={msgType}
            onChange={(e) => setMsgType(e.target.value)}
            className="filter-select"
          >
            <option value="All">All</option>
            <option value="Normal">Normal</option>
            <option value="Alarm">Alarm</option>
          </select>
        </div>

        {/* PLCCODE Filter */}
        <div className="filter-group">
          <div className="filter-label">PLCCODE</div>
          <select
            value={plcCode}
            onChange={(e) => setPlcCode(e.target.value)}
            className="filter-select"
          >
            {plcCodeOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* Date Range */}
        <div className="filter-date-group">
          <div className="date-input-container">
            <div className="filter-label">Start:</div>
            <input
              type="text"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="date-input"
              placeholder="YYYY-MM-DD"
            />
            <span className="calendar-icon">📅</span>
          </div>

          <div className="date-input-container">
            <div className="filter-label">End:</div>
            <input
              type="text"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="date-input"
              placeholder="YYYY-MM-DD"
            />
            <span className="calendar-icon">📅</span>
          </div>

          <button className="apply-date-btn" onClick={onDateApply}>
            Apply Date
          </button>
        </div>

        {/* Action Buttons */}
        <div className="filter-action-group">
          <button className="export-btn" onClick={onExport}>
            Export
          </button>
          <button className="clear-filter-btn" onClick={onClear}>
            Clear Filter
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      {stats && (
        <div className="status-progress-container">
          <div className="status-progress-text">
            Logs ทั้งหมด : <span className="status-label">{stats.total} records</span>
          </div>
          <div className="status-progress-bar">
            <div 
              className="status-progress-normal" 
              style={{ width: `${(stats.normal / stats.total) * 100}%` }}
            ></div>
            <div 
              className="status-progress-alarm" 
              style={{ width: `${(stats.alarm / stats.total) * 100}%` }}
            ></div>
          </div>
          <div className="status-progress-text">
            Status ปกติ : <span className="status-label">{stats.normal} ครั้ง ({((stats.normal / stats.total) * 100).toFixed(1)}%)</span>
          </div>
          <div className="status-progress-text">
            เกิด Alarm : <span className="status-label">{stats.alarm} ครั้ง ({((stats.alarm / stats.total) * 100).toFixed(1)}%)</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterControls;