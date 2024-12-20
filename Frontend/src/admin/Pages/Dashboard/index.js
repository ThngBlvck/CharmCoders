import React, { useState, useEffect } from "react";
import { getProduct } from "../../../services/Product";
import { getOrder } from "../../../services/Order";

// components
import PieChart from "../../components/Cards/PieChart";
import CardSocialTraffic from "../../components/Cards/CardSocialTraffic";
import CardStats from "../../components/Cards/CardStats";

export default function Dashboard() {
    const [totalRevenue, setTotalRevenue] = useState(0); // Tổng số tiền (đơn hàng status = 3)
    const [totalProducts, setTotalProducts] = useState(0); // Tổng số lượng sản phẩm
    const [totalPurchases, setTotalPurchases] = useState(0); // Tổng số lượt mua sản phẩm

    useEffect(() => {
        // Gọi API đồng thời
        Promise.all([getOrder(), getProduct()])
            .then(([ordersResponse, productsResponse]) => {
                // Xử lý dữ liệu đơn hàng
                const completedOrders = ordersResponse.data.filter(order => order.status === 3);
                const revenue = completedOrders.reduce((sum, order) => sum + order.total_amount, 0);
                setTotalRevenue(revenue);

                // Xử lý dữ liệu sản phẩm
                const totalProductCount = productsResponse.reduce((sum, product) => sum + product.quantity, 0);
                setTotalProducts(totalProductCount);

                const totalProductPurchases = productsResponse.reduce((sum, product) => sum + product.purchase_count, 0);
                setTotalPurchases(totalProductPurchases);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    }, []);

    return (
        <>
            <div className="flex flex-wrap justify-center">
                <div className="px-4 md:px-10 mx-auto w-full">
                    <div>
                        {/* Card stats */}
                        <div className="flex flex-wrap justify-between gap-4">
                            <div className="w-full sm:w-5/12 lg:w-1/4 xl:w-1/4">
                                <CardStats
                                    statSubtitle="Tổng số Tiền từ các đơn hàng"
                                    statTitle={new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(totalRevenue)}
                                    statPercentColor="text-emerald-500"
                                    statIconName="fas fa-dollar-sign"
                                    statIconColor="bg-green-500"
                                />

                            </div>
                            <div className="w-full sm:w-5/12 lg:w-1/4 xl:w-1/4 flex justify-center items-center">
                                <CardStats
                                    statSubtitle="Số lượng sản phẩm trong kho"
                                    statTitle={totalProducts}
                                    statPercentColor="text-blue-500"
                                    statIconName="fas fa-boxes"
                                    statIconColor="bg-blue-500"
                                />
                            </div>
                            <div className="w-full sm:w-5/12 lg:w-1/4 xl:w-1/4">
                                <CardStats
                                    statSubtitle="Tổng số lượng lượt mua "
                                    statTitle={totalPurchases}
                                    statPercentColor="text-orange-500"
                                    statIconName="fas fa-shopping-cart"
                                    statIconColor="bg-orange-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap justify-center mt-4">
                <div className="w-full xl:w-1/2 px-5">
                    <PieChart />
                </div>
                <div className="w-full xl:w-1/2 px-5">
                    <CardSocialTraffic />
                </div>
            </div>
        </>
    );
}
