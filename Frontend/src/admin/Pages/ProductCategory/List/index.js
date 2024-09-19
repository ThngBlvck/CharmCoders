import React from "react";
import PropTypes from "prop-types";
import {NavLink} from "react-router-dom";

// components

export default function ProductCategory({ color }) {
    return (
        <>
            <div
                className={
                    "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
                    (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")
                }
            >
                <div className="rounded-t mb-0 px-4 py-3 border-0">
                    <div className="flex flex-wrap items-center">
                        <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                            <h3
                                className={
                                    "font-semibold text-lg " +
                                    (color === "light" ? "text-blueGray-700" : "text-white")
                                }
                            >
                                DANH MỤC SẢN PHẨM
                            </h3>
                        </div>
                        <NavLink to={`/admin/category_product/add`}
                            className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button">
                            Thêm Sản Phẩm
                        </NavLink>
                    </div>
                </div>
                <div className="block w-full overflow-x-auto">
                    {/* Projects table */}
                    <table className="items-center w-full bg-transparent border-collapse table-fixed">
                        <thead>
                        <tr>
                            <th
                                className={
                                    "px-6 py-3 border border-solid text-xs uppercase font-semibold text-left " +
                                    (color === "light"
                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                }
                                style={{ width: "10%" }}
                            >
                                STT
                            </th>
                            <th
                                className={
                                    "px-6 py-3 border border-solid text-xs uppercase font-semibold text-left " +
                                    (color === "light"
                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                }
                                style={{ width: "40%" }}
                            >
                                Tên danh mục
                            </th>
                            <th
                                className={
                                    "px-6 py-3 border border-solid text-xs uppercase font-semibold text-left " +
                                    (color === "light"
                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                }
                                style={{ width: "25%" }}
                            >
                                Trạng Thái
                            </th>
                            <th
                                className={
                                    "px-6 py-3 border border-solid text-xs uppercase font-semibold text-left " +
                                    (color === "light"
                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                }
                                style={{ width: "25%" }}
                            >
                                Hành động
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4 text-left flex items-center">
                                    <span
                                        className={
                                            "ml-3 font-bold " +
                                            (color === "light" ? "text-blueGray-600" : "text-white")
                                        }
                                    >
                                        1
                                    </span>
                            </th>
                            <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4">
                                Son
                            </td>
                            <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4">
                                <i className=""></i> pending
                            </td>
                            <td className="border-t-0 px-6 align-middle text-xs whitespace-nowrap p-4">
                                <button className="text-blue-500 hover:text-blue-700 px-2">
                                    <i className="fas fa-pen text-xl"></i>
                                </button>
                                <button className="text-red-500 hover:text-red-700 ml-2 px-2" >
                                    <i className="fas fa-trash text-xl"></i>
                                </button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

ProductCategory.defaultProps = {
    color: "light",
};

ProductCategory.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
};
