// src/services/mockData.js

// SRM values
const SRM_VALUES = [1, 2, 3, 4, 5, 6, 7, 8];

// PLC code values
const NORMAL_PLCCODE_VALUES = [1, 2, 5, 10, 20, 30, 50, 80, 90];
const ALARM_PLCCODE_VALUES = [101, 102, 103, 104, 105];

const NORMAL_MSGLOG_VALUES = [
  "System started normally",
  "Pallet retrieved successfully",
  "Pallet stored successfully",
  "Routine maintenance check passed",
  "System operating within normal parameters",
  "Inventory check completed",
  "Position calibration successful",
  "Normal operation cycle completed",
  "System idle - awaiting command",
];

const ALARM_MSGLOG_VALUES = [
  "Alarm: Motor overheating",
  "Error: Position sensor failure",
  "Warning: Low battery",
  "Maintenance required",
  "Fault: Communication error",
  "System shutdown",
  "Alarm: Obstacle detected",
  "Error: Pallet misalignment",
  "Warning: Approaching operational limits",
  "Fault: Drive system error",
];

// Utility
function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Generate random date between start and end dates
function getRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Format date to YYYY-MM-DD
function formatDate(date) {
  try {
    return date.toISOString().split('T')[0];
  } catch (e) {
    console.error("Invalid date:", date);
    return new Date().toISOString().split('T')[0]; // Return today's date as fallback
  }
}

// Generate mock records with date range
export function generateMockData(numRecords = 200, startDate, endDate) {
  // Set default date range if not provided (last 30 days to today)
  const today = new Date();
  const defaultStartDate = new Date();
  defaultStartDate.setDate(today.getDate() - 30);
  
  // Convert string dates to Date objects if they're not already
  const start = startDate ? (startDate instanceof Date ? startDate : new Date(startDate)) : defaultStartDate;
  const end = endDate ? (endDate instanceof Date ? endDate : new Date(endDate)) : today;
  
  // Validate dates
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    console.error("Invalid date input, using default date range");
    start = defaultStartDate;
    end = today;
  }
  
  let data = [];
  let normalCount = 0;
  let alarmCount = 0;
  
  for (let i = 0; i < numRecords; i++) {
    const isNormal = Math.random() < 0.65; // 65% normal, 35% alarm
    const recordDate = getRandomDate(start, end);
    const srm = getRandomItem(SRM_VALUES);
    let plccode, msglog, msgtype;

    if (isNormal) {
      plccode = getRandomItem(NORMAL_PLCCODE_VALUES);
      msglog = getRandomItem(NORMAL_MSGLOG_VALUES);
      msgtype = "Normal";
      normalCount++;
    } else {
      plccode = getRandomItem(ALARM_PLCCODE_VALUES);
      msglog = getRandomItem(ALARM_MSGLOG_VALUES);
      msgtype = "Alarm";
      alarmCount++;
    }

    data.push({
      id: i + 1,
      ASRS: srm,
      PLCCODE: plccode,
      MSGTYPE: msgtype,
      MSGLOG: msglog,
      CDATE: formatDate(recordDate),
      CTIME: recordDate.toTimeString().split(' ')[0],
      timestamp: recordDate.getTime(),
    });
  }

  // Sort by date and time (newest first)
  data.sort((a, b) => b.timestamp - a.timestamp);

  return {
    data,
    stats: {
      total: numRecords,
      normal: normalCount,
      alarm: alarmCount
    }
  };
}

// Filter data based on criteria
export function filterData(data, filters) {
  const { srm, msgType, plcCode, startDate, endDate } = filters;
  
  return data.filter(item => {
    // Filter by SRM
    if (srm !== "All" && String(item.ASRS) !== String(srm)) {
      return false;
    }
    
    // Filter by MSGTYPE
    if (msgType !== "All" && item.MSGTYPE !== msgType) {
      return false;
    }
    
    // Filter by PLCCODE
    if (plcCode !== "All" && String(item.PLCCODE) !== String(plcCode)) {
      return false;
    }
    
    // Filter by date range
    if (startDate && endDate) {
      const recordDate = new Date(item.CDATE);
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      // Set time to beginning/end of day for proper comparison
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      
      if (recordDate < start || recordDate > end) {
        return false;
      }
    }
    
    return true;
  });
}

// Calculate stats from filtered data
export function calculateStats(filteredData) {
  const total = filteredData.length;
  const normal = filteredData.filter(item => item.MSGTYPE === "Normal").length;
  
  return {
    total,
    normal,
    alarm: total - normal
  };
}