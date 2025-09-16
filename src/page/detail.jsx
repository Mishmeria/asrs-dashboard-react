import React, { useState, useEffect } from "react";
import Button from "../components/button";
import "../style/detail.css";

const Detail = ({ data = [] }) => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 20;

  // Filter state for search only (other filters are handled by the global filter)
  const [filteredData, setFilteredData] = useState(data);
  const [searchTerm, setSearchTerm] = useState("");

  // Update filtered data when props data changes
  useEffect(() => {
    setFilteredData(data);
    setCurrentPage(0); // Reset to first page when data changes
  }, [data]);

  // Apply search filter
  useEffect(() => {
    let result = [...data];

    // Filter by search term (in message text)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.MSGLOG.toLowerCase().includes(term)
      );
    }

    setFilteredData(result);
    setCurrentPage(0); // Reset to first page when filters change
  }, [searchTerm, data]);

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm("");
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

      {/* Search Box Only */}
      <div className="detail-search">
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
              onClick={handleClearSearch}
            >
              ×
            </button>
          )}
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