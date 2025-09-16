import React from "react";

const StatusProgress = ({ total, normal, alarm }) => {
  const percentNormal = total ? (normal / total) * 100 : 0;

  return (
    <div style={{ padding: 10, background: "white", borderRadius: 4 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 20,
          fontSize: 14,
          fontWeight: "bold",
        }}
      >
        <span style={{ color: "#0d47a1" }}>Logs ทั้งหมด : {total} records</span>
        <span style={{ color: "#2e7d32" }}>
          Status ปกติ : {normal} ครั้ง ({percentNormal.toFixed(1)}%)
        </span>
        <span style={{ color: "#c62828" }}>
          เกิด Alarm : {alarm} ครั้ง ({(100 - percentNormal).toFixed(1)}%)
        </span>
      </div>

      <div
        style={{
          marginTop: 8,
          height: 20,
          background: "#ef9a9a",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percentNormal}%`,
            background: "#81c784",
            height: "100%",
          }}
        />
      </div>
    </div>
  );
};

export default StatusProgress;
