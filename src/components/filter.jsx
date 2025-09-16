import React from "react";
import Dropdown from "./dropdown";
import Button from "./button";
import DateChip from "./date_selc";
import StatusProgress from "./bar";

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
  onSearch,
  onExport,
  onClear,
  stats,
}) => {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        {/* Left */}
        <div style={{ display: "flex", gap: 15 }}>
          <Dropdown
            label="SRM"
            value={srm}
            options={["All", "1", "2", "3", "4", "5", "6", "7", "8"]}
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
            options={["All", "101", "102", "103"]}
            onChange={setPlcCode}
          />
        </div>

        {/* Center */}
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <DateChip label="Start" value={startDate} onClick={() => setStartDate(new Date())} />
          <DateChip label="End" value={endDate} onClick={() => setEndDate(new Date())} />
          <Button text="Apply" bgColor="orange" onClick={onSearch} />
        </div>

        {/* Right */}
        <div style={{ display: "flex", gap: 12 }}>
          <Button text="Export" bgColor="green" onClick={onExport} />
          <Button text="Clear Filter" bgColor="orange" onClick={onClear} />
        </div>
      </div>

      {/* Progress */}
      <StatusProgress total={stats.total} normal={stats.normal} alarm={stats.alarm} />
    </div>
  );
};

export default FilterControls;
