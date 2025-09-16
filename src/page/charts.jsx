import React, { useEffect, useState } from "react";
import {BarChart,Bar,XAxis,YAxis,Tooltip,CartesianGrid,ResponsiveContainer,} from "recharts";
import { generateMockData } from "../services/mockData";
import "../style/logsChart.css";

const LogsChart = ({ data }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (data && data.length > 0) {
      const grouped = data.reduce((acc, log) => {
        const code = log.PLCCODE;
        if (!acc[code]) acc[code] = { plccode: code, count: 0 };
        acc[code].count++;
        return acc;
      }, {});
      setChartData(Object.values(grouped));
    } else {
      setChartData([]);
    }
  }, [data]);

  return (
    <div className="logs-chart-container">
      <h3 className="logs-chart-title">กราฟแสดงข้อมูลตั้งแต่วันที่ xx ถึงวันที่ yy</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="plccode" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#e67e22" barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LogsChart;
