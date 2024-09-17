import React, { useRef, useEffect } from "react";
import { Chart, LineController, LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

// Đăng ký các thành phần trước khi sử dụng
Chart.register(LineController, LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

export default function CardLineChart() {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      // Xóa biểu đồ cũ nếu có
      if (chartRef.current.chartInstance) {
        chartRef.current.chartInstance.destroy();
      }

      const ctx = chartRef.current.getContext('2d');

      const config = {
        type: "line",
        data: {
          labels: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
          ],
          datasets: [
            {
              label: new Date().getFullYear(),
              backgroundColor: "#4c51bf",
              borderColor: "#4c51bf",
              data: [65, 78, 66, 44, 56, 67, 75],
              fill: false,
            },
            {
              label: new Date().getFullYear() - 1,
              fill: false,
              backgroundColor: "#fff",
              borderColor: "#fff",
              data: [40, 68, 86, 74, 56, 60, 87],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: false,
              text: "Sales Charts",
              color: "white",
            },
            legend: {
              labels: {
                color: "white",
              },
              align: "end",
              position: "bottom",
            },
            tooltip: {
              mode: "index",
              intersect: false,
            },
          },
          hover: {
            mode: "nearest",
            intersect: true,
          },
          scales: {
            x: {
              ticks: {
                color: "rgba(255,255,255,.7)",
              },
              grid: {
                display: false,
                borderDash: [2],
                borderDashOffset: [2],
                color: "rgba(33, 37, 41, 0.3)",
                zeroLineColor: "rgba(0, 0, 0, 0)",
                zeroLineBorderDash: [2],
                zeroLineBorderDashOffset: [2],
              },
            },
            y: {
              ticks: {
                color: "rgba(255,255,255,.7)",
              },
              grid: {
                borderDash: [3],
                borderDashOffset: [3],
                drawBorder: false,
                color: "rgba(255, 255, 255, 0.15)",
                zeroLineColor: "rgba(33, 37, 41, 0)",
                zeroLineBorderDash: [2],
                zeroLineBorderDashOffset: [2],
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
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-blueGray-700">
        <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full max-w-full flex-grow flex-1">
              <h6 className="uppercase text-blueGray-100 mb-1 text-xs font-semibold">
                Overview
              </h6>
              <h2 className="text-white text-xl font-semibold">Sales value</h2>
            </div>
          </div>
        </div>
        <div className="p-4 flex-auto">
          {/* Biểu đồ */}
          <div className="relative h-350-px">
            <canvas ref={chartRef}></canvas>
          </div>
        </div>
      </div>
  );
}
