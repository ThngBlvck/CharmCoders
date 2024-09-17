import React, { useRef, useEffect } from "react";
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

// Đăng ký các phần tử và điều khiển của Chart.js
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

export default function CardBarChart() {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      // Xóa biểu đồ cũ nếu có
      if (chartRef.current.chartInstance) {
        chartRef.current.chartInstance.destroy();
      }

      const ctx = chartRef.current.getContext('2d');

      let config = {
        type: "bar",
        data: {
          labels: ["January", "February", "March", "April", "May", "June", "July"],
          datasets: [
            {
              label: new Date().getFullYear(),
              backgroundColor: "#ed64a6",
              borderColor: "#ed64a6",
              data: [30, 78, 56, 34, 100, 45, 13],
              barThickness: 8,
            },
            {
              label: new Date().getFullYear() - 1,
              backgroundColor: "#4c51bf",
              borderColor: "#4c51bf",
              data: [27, 68, 86, 74, 10, 4, 87],
              barThickness: 8,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              labels: {
                color: "rgba(0,0,0,.4)",
              },
              align: "end",
              position: "bottom",
            },
            title: {
              display: false, // Nếu không cần tiêu đề
            }
          },
          scales: {
            x: {
              display: false,
            },
            y: {
              display: true,
              grid: {
                color: "rgba(33, 37, 41, 0.2)",
              },
            },
          },
        },
      };

      // Tạo mới biểu đồ
      const chart = new Chart(ctx, config);

      // Lưu instance của biểu đồ để có thể hủy sau này
      chartRef.current.chartInstance = chart;

      return () => {
        chart.destroy();
      };
    }
  }, []);

  return (
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full max-w-full flex-grow flex-1">
              <h6 className="uppercase text-blueGray-400 mb-1 text-xs font-semibold">
                Performance
              </h6>
              <h2 className="text-blueGray-700 text-xl font-semibold">
                Total orders
              </h2>
            </div>
          </div>
        </div>
        <div className="p-4 flex-auto">
          <div className="relative h-350-px">
            <canvas ref={chartRef}></canvas>
          </div>
        </div>
      </div>
  );
}
