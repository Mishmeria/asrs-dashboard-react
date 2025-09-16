// src/services/mockData.js

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

// Generate mock records
export function generateMockData(numRecords = 200) {
  let data = [];
  for (let i = 0; i < numRecords; i++) {
    const isNormal = Math.random() < 0.7;
    let plccode, msglog;

    if (isNormal) {
      plccode = getRandomItem(NORMAL_PLCCODE_VALUES);
      msglog = getRandomItem(NORMAL_MSGLOG_VALUES);
    } else {
      plccode = getRandomItem(ALARM_PLCCODE_VALUES);
      msglog = getRandomItem(ALARM_MSGLOG_VALUES);
    }

    data.push({
      PLCCODE: plccode,
      MSGLOG: msglog,
    });
  }

  return data;
}
