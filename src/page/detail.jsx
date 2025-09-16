import React, { useState, useEffect } from "react";
import Dropdown from "../components/dropdown";
import DatePicker from "../components/DatePicker";
import Button from "../components/button";
import "../style/detail.css";

const Detail = ({ data = [] }) => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 20;

  // Filter state
  const [filteredData, setFilteredData] = useState(data);
  const [srm, setSrm] = useState("All");
  const [msgType, setMsgType] = useState("All");
  const [plcCode, setPlcCode] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Update filtered data when props data changes
  useEffect(() => {
    setFilteredData(data);
    setCurrentPage(0); // Reset to first page when data changes
  }, [data]);

  // Apply filters when filter state changes
  useEffect(() => {
    let result = [...data];

    // Filter by SRM
    if (srm !== "All") {
      result = result.filter(item => String(item.ASRS) === String(srm));
    }

    // Filter by MSGTYPE
    if (msgType !== "All") {
      result = result.filter(item => item.MSGTYPE === msgType);
    }

    // Filter by PLCCODE
    if (plcCode !== "All") {
      result = result.filter(item => String(item.PLCCODE) === String(plcCode));
    }

    // Filter by date range
    if (startDate && endDate) {
      result = result.filter(item => {
        const rowDate = new Date(item.CDATE);
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        // Set time to beginning/end of day for proper comparison
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        
        return rowDate >= start && rowDate <= end;
      });
    }

    // Filter by search term (in message text)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.MSGLOG.toLowerCase().includes(term)
      );
    }

    setFilteredData(result);
    setCurrentPage(0); // Reset to first page when filters change
  }, [srm, msgType, plcCode, startDate, endDate, searchTerm, data]);

  // Clear filters
  const handleClearFilters = () => {
    setSrm("All");
    setMsgType("All");
    setPlcCode("All");
    setStartDate("");
    setEndDate("");
    setSearchTerm("");
  };

  // Get unique SRM values for dropdown
  const getSrmOptions = () => {
    const uniqueSrms = [...new Set(data.map(item => item.ASRS))].sort();
    return ["All", ...uniqueSrms.map(String)];
  };

  // Get unique PLCCODE values for dropdown
  const getPlcCodeOptions = () => {
    const uniquePlcCodes = [...new Set(data.map(item => item.PLCCODE))].sort((a, b) => a - b);
    return ["All", ...uniquePlcCodes.map(String)];
  };

  // Pagination logic
  const startIndex = currentPage * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRows = filteredData.slice(startIndex, endIndex);
  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));

  // Handle page navigation
  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  };

  return (
    <div className="detail-container">
      <h2>📜 รายละเอียด (Detail Logs)</h2>

      {/* Filter Section */}
      <div className="detail-filters">
        <div className="filter-row">
          <div className="filter-group">
            <Dropdown
              label="SRM"
              value={srm}
              options={getSrmOptions()}
              onChange={setSrm}
            />
            <Dropdown
              label="MSGTYPE"
              value={msgType}
              options={["All", "Normal", "Alarm"]}
              onChange={setMsgType}
            />
            <Dropdown
              label="PLCCODE"
              value={plcCode}
              options={getPlcCodeOptions()}
              onChange={setPlcCode}
            />
          </div>

          <div className="filter-group">
            <DatePicker label="Start Date" value={startDate} onChange={setStartDate} />
            <DatePicker label="End Date" value={endDate} onChange={setEndDate} />
          </div>

          <div className="filter-group">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search in messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button 
                  className="clear-search" 
                  onClick={() => setSearchTerm("")}
                >
                  ×
                </button>
              )}
            </div>
            <Button text="Clear Filters" bgColor="orange" onClick={handleClearFilters} />
          </div>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <div className="pagination-info">
          Showing {filteredData.length ? startIndex + 1 : 0}–{Math.min(endIndex, filteredData.length)} of {filteredData.length} records
        </div>
        <div className="pagination-buttons">
          <button 
            onClick={handlePrevPage} 
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
            onClick={handleNextPage} 
            disabled={currentPage >= totalPages - 1}
            className="pagination-button"
          >
            Next &gt;
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="table-wrapper">
        <table className="detail-table">
          <thead>
            <tr>
              <th>DATE</th>
              <th>TIME</th>
              <th>SRM</th>
              <th>PLCCODE</th>
              <th>MSGTYPE</th>
              <th>MESSAGE</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.length > 0 ? (
              currentRows.map((row, idx) => (
                <tr
                  key={idx}
                  className={row.MSGTYPE === "Alarm" ? "alarm-row" : ""}
                >
                  <td>{row.CDATE}</td>
                  <td>{row.CTIME}</td>
                  <td>{row.ASRS}</td>
                  <td>{row.PLCCODE}</td>
                  <td>
                    <span className={`status-badge ${row.MSGTYPE === "Alarm" ? "status-alarm" : "status-normal"}`}>
                      {row.MSGTYPE}
                    </span>
                  </td>
                  <td>{row.MSGLOG}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">
                  No data available for the selected filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Detail;