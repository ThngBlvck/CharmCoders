import React from "react";

// components
import PieChart from "../../components/Cards/PieChart";
import CardLineChart from "../../components/Cards/CardLineChart";
import CardBarChart from "../../components/Cards/CardBarChart";
import CardPageVisits from "../../components/Cards/CardPageVisits";
import CardSocialTraffic from "../../components/Cards/CardSocialTraffic";

export default function Dashboard() {
    return (
        <>
            <div className="flex flex-wrap justify-center">
                <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
                    {/* Nếu cần thêm nội dung ở đây */}
                </div>
                <div className="w-full xl:w-4/12 px-4">
                    {/* Nếu cần thêm nội dung ở đây */}
                </div>
            </div>
            <div className="flex flex-wrap justify-center mt-4">
                <div className="w-full xl:w-1/2 px-5">
                    <PieChart/>
                </div>
                <div className="w-full xl:w-1/2 px-5">
                    <CardSocialTraffic/>
                </div>

            </div>
        </>
    );
}
