import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { getBrand } from "../../../services/Brand";
import { getProduct } from "../../../services/Product";
import {PulseLoader} from "react-spinners";

export default function BeautifulPieChart() {
    const [chartData, setChartData] = useState({
        series: [],
        labels: [],
        colors: [],
    });
    const [loading, setLoading] = useState(true);

    // Hàm lấy màu từ danh sách không trùng lặp
    const getUniqueColors = (count) => {
        const baseColors = ["#FF4560", "#008FFB", "#00E396", "#FEB019", "#775DD0", "#FF33CC", "#6633CC", "#D29680"];
        const usedColors = [];
        for (let i = 0; i < count; i++) {
            const color = baseColors[i % baseColors.length];
            if (!usedColors.includes(color)) {
                usedColors.push(color);
            }
        }
        return usedColors;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const brandResponse = await getBrand();
                const productResponse = await getProduct();

                console.log("Brand Response:", brandResponse);
                console.log("Product Response:", productResponse);

                const brands = brandResponse || [];
                const products = productResponse || [];

                if (brands.length === 0 || products.length === 0) {
                    throw new Error("API response does not contain the expected data structure.");
                }

                // Xử lý dữ liệu series và labels
                const series = brands.map((brand) => {
                    return products.filter((product) => product.brand_id === brand.id).length;
                });

                const labels = brands.map((brand) => brand.name);

                // Lấy danh sách màu không trùng lặp tương ứng với số lượng nhãn
                const colors = getUniqueColors(labels.length);

                setChartData({ series, labels, colors });
            } catch (error) {
                console.error("Error fetching chart data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const chartConfig = {
        series: chartData.series,
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
            labels: chartData.labels,
            colors: chartData.colors, // Sử dụng màu không trùng lặp
            stroke: {
                width: 1,
                colors: ["#fff"],
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
                type: "gradient",
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
        <div className="w-full flex justify-center items-center h-full">
            <div className={"w-full font-bold text-center text-black"}>Thống Kê Nhãn Hàng</div>
            {loading ? (
                <div className="flex justify-center items-center py-4">
                    <PulseLoader color="#4A90E2" loading={loading} size={15}/>
                </div>
            ) : (
            <div className="w-full flex justify-center items-center">
                <Chart
                options={chartConfig.options}
                series={chartConfig.series}
                type="pie"
                width="600"
            />
            </div>
                )}
        </div>
    );
}
