import React from "react";
import Chart from "react-apexcharts";

export default function BeautifulPieChart() {
    const chartConfig = {
        series: [44, 55, 13, 43, 22], // Dữ liệu
        options: {
            chart: {
                type: "pie",
                width: 400,
                animations: {
                    enabled: true,
                    easing: "easeinout",
                    speed: 800,
                },
            },
            labels: ["Apple", "Mango", "Orange", "Banana", "Pineapple"], // Nhãn
            colors: ["#FF4560", "#008FFB", "#00E396", "#FEB019", "#775DD0"], // Màu cho các phần
            stroke: {
                width: 1,
                colors: ["#fff"], // Đường viền màu trắng
            },
            dataLabels: {
                dropShadow: {
                    enabled: true,
                    top: 2,
                    left: 2,
                    blur: 4,
                    opacity: 0.7,
                },
            },
            fill: {
                type: "gradient", // Gradient màu cho biểu đồ
            },
            legend: {
                position: "bottom",
                fontSize: "14px",
                labels: {
                    colors: ["#333"],
                    useSeriesColors: false,
                },
            },
            tooltip: {
                enabled: true,
                fillSeriesColor: true,
            },
        },
    };

    return (
        <div className="flex justify-center items-center h-full">
            <Chart
                options={chartConfig.options}
                series={chartConfig.series}
                type="pie"
                width="600"
            />
        </div>
    );
}
