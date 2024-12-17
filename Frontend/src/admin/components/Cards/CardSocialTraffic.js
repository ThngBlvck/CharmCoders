import React, { useState, useEffect } from "react";
import { getCategory } from "../../../services/Category";
import { getProduct } from "../../../services/Product";
import {PulseLoader} from "react-spinners";

const CardSocialTraffic = () => {
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [productsCountByCategory, setProductsCountByCategory] = useState({});
    const [chartData, setChartData] = useState({ series: [], labels: [], colors: [] });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const getUniqueColors = (count) => {
        const colors = ["red", "green", "blue", "yellow", "purple", "orange"];
        return Array.from({ length: count }, () => colors[Math.floor(Math.random() * colors.length)]);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const categoryResponse = await getCategory();
                const productResponse = await getProduct();

                const category = categoryResponse || [];
                const products = productResponse || [];

                if (category.length === 0 || products.length === 0) {
                    throw new Error("API response does not contain the expected data structure.");
                }

                // Đếm số lượng sản phẩm trong mỗi danh mục
                const counts = category.reduce((acc, cat) => {
                    acc[cat.name] = products.filter((product) => product.category_id === cat.id).length;
                    return acc;
                }, {});

                // Sắp xếp danh mục theo số lượng sản phẩm giảm dần
                const sortedCategories = category.sort((a, b) => {
                    const countA = counts[a.name] || 0;
                    const countB = counts[b.name] || 0;
                    return countB - countA;
                });

                setCategories(sortedCategories);
                setProductsCountByCategory(counts);

                const series = sortedCategories.map((cat) => counts[cat.name] || 0);
                const labels = sortedCategories.map((cat) => cat.name);
                const colors = getUniqueColors(labels.length);

                setChartData({ series, labels, colors });
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Logic for pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = categories.slice(indexOfFirstItem, indexOfLastItem);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(categories.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            <div className="rounded-t mb-0 px-4 py-3 border-0">
                <div className="flex flex-wrap items-center">
                    <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                        <h3 className="font-semibold text-base text-blueGray-700"
                            style={{fontFamily: 'Roboto, sans-serif'}}
                        >Thống Kê Số Lượng Sản Phẩm Theo Danh Mục Sản Phẩm</h3>
                    </div>
                </div>
            </div>
            {loading ? (
                <div className="flex justify-center items-center py-4">
                    <PulseLoader color="#4A90E2" loading={loading} size={15}/>
                </div>
            ) : (
            <div className="block w-full overflow-x-auto">
                <table className="items-center w-full bg-transparent border-collapse">
                    <thead className="thead-light">
                    <tr>
                        <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center">
                            Danh Mục
                        </th>
                        <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center">
                            Sản Phẩm
                        </th>
                        <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center">
                            Phần Trăm
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentItems.map((category, index) => {
                        const productCount = productsCountByCategory[category.name] || 0;
                        const totalProducts = Object.values(productsCountByCategory).reduce((sum, count) => sum + count, 0);
                        const percentage = totalProducts > 0 ? ((productCount / totalProducts) * 100).toFixed(2) : 0;

                        return (
                            <tr key={index}>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center">
                                    {category.name}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs text-center whitespace-nowrap p-4">
                                    {productCount}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs text-center whitespace-nowrap p-4">
                                    {percentage}%
                                    <div className="h-2 bg-gray-200 rounded">
                                        <div
                                            className="bg-blue-500 h-2 rounded"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
            )}

            {/* Pagination */}
            <div className="mt-4 mb-1 flex justify-center">
                {pageNumbers.map(number => (
                    <button
                        key={number}
                        onClick={() => setCurrentPage(number)}
                        className={`mx-1 px-3 py-1 rounded ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                    >
                        {number}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CardSocialTraffic;
