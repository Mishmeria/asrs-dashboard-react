import React, { useState, useRef, useEffect } from "react";
import "../style/App.css";

const DatePicker = ({ label, value, onChange }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const calendarRef = useRef(null);

  // Close calendar when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Format date as YYYY-MM-DD
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Parse date string to Date object
  const parseDate = (dateStr) => {
    if (!dateStr) return new Date();
    return new Date(dateStr);
  };

  // Handle date selection
  const handleDateSelect = (day) => {
    const newDate = new Date(currentMonth);
    newDate.setDate(day);
    onChange(formatDate(newDate));
    setShowCalendar(false);
  };

  // Navigate to previous month
  const prevMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
  };

  // Navigate to next month
  const nextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1).getDay();
    
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= lastDay; day++) {
      const date = new Date(year, month, day);
      const isSelected = value && formatDate(date) === value;
      
      days.push(
        <div
          key={day}
          className={`calendar-day ${isSelected ? "selected" : ""}`}
          onClick={() => handleDateSelect(day)}
        >
          {day}
        </div>
      );
    }
    
    return days;
  };

  // Get month name
  const getMonthName = (date) => {
    return date.toLocaleString("default", { month: "long" });
  };

  return (
    <div className="date-picker-container">
      <div className="date-display" onClick={() => setShowCalendar(!showCalendar)}>
        <span>{label}: {value || "Select"}</span>
        <button className="calendar-button">📅</button>
      </div>
      
      {showCalendar && (
        <div className="calendar-popup" ref={calendarRef}>
          <div className="calendar-header">
            <button onClick={prevMonth}>&lt;</button>
            <div>
              {getMonthName(currentMonth)} {currentMonth.getFullYear()}
            </div>
            <button onClick={nextMonth}>&gt;</button>
          </div>
          
          <div className="calendar-weekdays">
            <div>Su</div>
            <div>Mo</div>
            <div>Tu</div>
            <div>We</div>
            <div>Th</div>
            <div>Fr</div>
            <div>Sa</div>
          </div>
          
          <div className="calendar-days">{generateCalendarDays()}</div>
          
          <div className="calendar-footer">
            <button 
              className="today-button"
              onClick={() => {
                const today = formatDate(new Date());
                onChange(today);
                setShowCalendar(false);
              }}
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;