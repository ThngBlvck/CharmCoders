import React from "react";
import PropTypes from "prop-types";

// components

export default function Comment({ color }) {
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
                                Bình luận
                            </h3>
                        </div>
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
                                style={{width: "10%"}}
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
                                style={{width: "40%"}}
                            >
                                Nội dung
                            </th>
                            <th
                                className={
                                    "px-6 py-3 border border-solid text-xs uppercase font-semibold text-left " +
                                    (color === "light"
                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                }
                                style={{width: "40%"}}
                            >
                                người dùng
                            </th>
                            <th
                                className={
                                    "px-6 py-3 border border-solid text-xs uppercase font-semibold text-left " +
                                    (color === "light"
                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                }
                                style={{width: "40%"}}
                            >
                                sản phẩm
                            </th>
                            <th
                                className={
                                    "px-6 py-3 border border-solid text-xs uppercase font-semibold text-left " +
                                    (color === "light"
                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                }
                                style={{width: "25%"}}
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
                                style={{width: "25%"}}
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
                            <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4">
                                <i className=""></i> pending
                            </td>
                            <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4">
                                <i className=""></i> pending
                            </td>
                            <td className="border-t-0 px-6 align-middle text-xs whitespace-nowrap p-4">
                                <button className="text-blue-500 hover:text-blue-700 px-2">
                                    <i className="fas fa-pen text-xl"></i>
                                </button>
                                <button className="text-red-500 hover:text-red-700 ml-2 px-2">
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

Comment.defaultProps = {
    color: "light",
};

Comment.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
};
