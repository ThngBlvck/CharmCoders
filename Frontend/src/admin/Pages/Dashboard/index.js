import React from "react";

// components
import PieChart from "../../components/Cards/PieChart";
import CardLineChart from "../../components/Cards/CardLineChart";
import CardBarChart from "../../components/Cards/CardBarChart";
import CardPageVisits from "../../components/Cards/CardPageVisits";
import CardSocialTraffic from "../../components/Cards/CardSocialTraffic";
import CardStats from "../../components/Cards/CardStats";

export default function Dashboard() {
    return (
        <>
            <div className="flex flex-wrap justify-center">
                <div className="px-4 md:px-10 mx-auto w-full">
                    <div>
                        {/* Card stats */}
                        <div className="flex flex-wrap">
                            <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                                <CardStats
                                    statSubtitle="TRAFFIC"
                                    statTitle="350,897"
                                    statArrow="up"
                                    statPercent="3.48"
                                    statPercentColor="text-emerald-500"
                                    statDescripiron="Since last month"
                                    statIconName="far fa-chart-bar"
                                    statIconColor="bg-red-500"
                                />
                            </div>
                            <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                                <CardStats
                                    statSubtitle="NEW USERS"
                                    statTitle="2,356"
                                    statArrow="down"
                                    statPercent="3.48"
                                    statPercentColor="text-red-500"
                                    statDescripiron="Since last week"
                                    statIconName="fas fa-chart-pie"
                                    statIconColor="bg-orange-500"
                                />
                            </div>
                            <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                                <CardStats
                                    statSubtitle="SALES"
                                    statTitle="924"
                                    statArrow="down"
                                    statPercent="1.10"
                                    statPercentColor="text-orange-500"
                                    statDescripiron="Since yesterday"
                                    statIconName="fas fa-users"
                                    statIconColor="bg-pink-500"
                                />
                            </div>
                            <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                                <CardStats
                                    statSubtitle="PERFORMANCE"
                                    statTitle="49,65%"
                                    statArrow="up"
                                    statPercent="12"
                                    statPercentColor="text-emerald-500"
                                    statDescripiron="Since last month"
                                    statIconName="fas fa-percent"
                                    statIconColor="bg-lightBlue-500"
                                />
                            </div>
                        </div>
                    </div>
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
