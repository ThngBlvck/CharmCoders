import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
    const [collapseShow, setCollapseShow] = React.useState("hidden");
    const location = useLocation(); // Lấy đường dẫn hiện tại

    return (
        <>
            <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
                <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
                    {/* Toggler */}
                    <button
                        className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                        type="button"
                        onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}
                    >
                        <i className="fas fa-bars"></i>
                    </button>
                    {/* Brand */}
                    <Link
                        className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold px-3 py-1"
                        to="/"
                    >
                        ADMIN GLOWMAKER
                    </Link>
                    {/* Collapse */}
                    <div
                        className={`md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded ${collapseShow}`}
                    >
                        {/* Collapse header */}
                        <div className="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-blueGray-200">
                            <div className="flex flex-wrap">
                                <div className="w-6/12">
                                    <Link
                                        className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
                                        to="/"
                                    >
                                        ADMIN
                                    </Link>
                                </div>
                                <div className="w-6/12 flex justify-end">
                                    <button
                                        type="button"
                                        className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                                        onClick={() => setCollapseShow("hidden")}
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Navigation */}
                        <ul className="md:flex-col md:min-w-full flex flex-col list-none pl-4">
                            <li className="items-center">
                                <Link
                                    className={`text-xs uppercase py-3 font-bold block ${
                                        location.pathname === "/admin/dashboard"
                                            ? "text-lightBlue-500 hover:text-lightBlue-600"
                                            : "text-blueGray-700 hover:text-blueGray-500"
                                    }`}
                                    to="/admin/dashboard"
                                >
                                    <i className={`fas fa-tv mr-2 text-sm ${location.pathname === "/admin/dashboard" ? "opacity-75" : "text-blueGray-300"}`}></i>
                                    Dashboard
                                </Link>
                            </li>

                            <li className="items-center">
                                <Link
                                    className={`text-xs uppercase py-3 font-bold block ${
                                        location.pathname === "/admin/category_product"
                                            ? "text-lightBlue-500 hover:text-lightBlue-600"
                                            : "text-blueGray-700 hover:text-blueGray-500"
                                    }`}
                                    to="/admin/category_product"
                                >
                                    <i className={`fas fa-list mr-2 text-sm ${location.pathname === "/admin/category_product" ? "opacity-75" : "text-blueGray-300"}`}></i>
                                    Danh Mục Sản Phẩm
                                </Link>
                            </li>

                            <li className="items-center">
                                <Link
                                    className={`text-xs uppercase py-3 font-bold block ${
                                        location.pathname === "/admin/product"
                                            ? "text-lightBlue-500 hover:text-lightBlue-600"
                                            : "text-blueGray-700 hover:text-blueGray-500"
                                    }`}
                                    to="/admin/product"
                                >
                                    <i className={`fas fa-table mr-2 text-sm ${location.pathname === "/admin/product" ? "opacity-75" : "text-blueGray-300"}`}></i>
                                    Sản Phẩm
                                </Link>
                            </li>

                            <li className="items-center">
                                <Link
                                    className={`text-xs uppercase py-3 font-bold block ${
                                        location.pathname === "/admin/user"
                                            ? "text-lightBlue-500 hover:text-lightBlue-600"
                                            : "text-blueGray-700 hover:text-blueGray-500"
                                    }`}
                                    to="/admin/user"
                                >
                                    <i className={`fas fa-user mr-2 text-sm ${location.pathname === "/admin/user" ? "opacity-75" : "text-blueGray-300"}`}></i>
                                    Người Dùng
                                </Link>
                            </li>

                            <li className="items-center">
                                <Link
                                    className={`text-xs uppercase py-3 font-bold block ${
                                        location.pathname === "/admin/category_blog"
                                            ? "text-lightBlue-500 hover:text-lightBlue-600"
                                            : "text-blueGray-700 hover:text-blueGray-500"
                                    }`}
                                    to="/admin/category_blog"
                                >
                                    <i className={`fas fa-blog mr-2 text-sm ${location.pathname === "/admin/category_blog" ? "opacity-75" : "text-blueGray-300"}`}></i>
                                    Danh Mục Bài Viết
                                </Link>
                            </li>

                            <li className="items-center">
                                <Link
                                    className={`text-xs uppercase py-3 font-bold block ${
                                        location.pathname === "/admin/blog"
                                            ? "text-lightBlue-500 hover:text-lightBlue-600"
                                            : "text-blueGray-700 hover:text-blueGray-500"
                                    }`}
                                    to="/admin/blog"
                                >
                                    <i className={`fas fa-align-justify mr-2 text-sm ${location.pathname === "/admin/blog" ? "opacity-75" : "text-blueGray-300"}`}></i>
                                    Bài Viết
                                </Link>
                            </li>

                            <li className="items-center">
                                <Link
                                    className={`text-xs uppercase py-3 font-bold block ${
                                        location.pathname === "/admin/comment"
                                            ? "text-lightBlue-500 hover:text-lightBlue-600"
                                            : "text-blueGray-700 hover:text-blueGray-500"
                                    }`}
                                    to="/admin/comment"
                                >
                                    <i className={`fas fa-comment mr-2 text-sm ${location.pathname === "/admin/comment" ? "opacity-75" : "text-blueGray-300"}`}></i>
                                    Bình Luận
                                </Link>
                            </li>

                            <li className="items-center">
                                <Link
                                    className={`text-xs uppercase py-3 font-bold block ${
                                        location.pathname === "/admin/brand"
                                            ? "text-lightBlue-500 hover:text-lightBlue-600"
                                            : "text-blueGray-700 hover:text-blueGray-500"
                                    }`}
                                    to="/admin/brand"
                                >
                                    <i className={`fas fa-archive mr-2 text-sm ${location.pathname === "/admin/brand" ? "opacity-75" : "text-blueGray-300"}`}></i>
                                    Nhãn Hàng
                                </Link>
                            </li>

                            <li className="items-center">
                                <Link
                                    className={`text-xs uppercase py-3 font-bold block ${
                                        location.pathname === "/admin/order"
                                            ? "text-lightBlue-500 hover:text-lightBlue-600"
                                            : "text-blueGray-700 hover:text-blueGray-500"
                                    }`}
                                    to="/admin/order"
                                >
                                    <i className={`fas fa-box-open mr-2 text-sm ${location.pathname === "/admin/order" ? "opacity-75" : "text-blueGray-300"}`}></i>
                                    Đơn Hàng
                                </Link>
                            </li>

                            <li className="items-center">
                                <Link
                                    className={`text-xs uppercase py-3 font-bold block ${
                                        location.pathname === "/admin/review"
                                            ? "text-lightBlue-500 hover:text-lightBlue-600"
                                            : "text-blueGray-700 hover:text-blueGray-500"
                                    }`}
                                    to="/admin/review"
                                >
                                    <i className={`fas fas fa-star mr-2 text-sm ${location.pathname === "/admin/review" ? "opacity-75" : "text-blueGray-300"}`}></i>
                                    Đánh giá
                                </Link>
                            </li>

                            <li className="items-center">
                                <Link
                                    className={`text-xs uppercase py-3 font-bold block ${
                                        location.pathname === "/admin/role"
                                            ? "text-lightBlue-500 hover:text-lightBlue-600"
                                            : "text-blueGray-700 hover:text-blueGray-500"
                                    }`}
                                    to="/admin/role"
                                >
                                    <i className={`fas fa-user-tag mr-2 text-sm ${location.pathname === "/admin/role" ? "opacity-75" : "text-blueGray-300"}`}></i>
                                    Vai trò
                                </Link>
                            </li>
                            <li className="items-center">
                                <Link
                                    className={`text-xs uppercase py-3 font-bold block ${
                                        location.pathname === "/admin/banner"
                                            ? "text-lightBlue-500 hover:text-lightBlue-600"
                                            : "text-blueGray-700 hover:text-blueGray-500"
                                    }`}
                                    to="/admin/banner"
                                >
                                    <i className={`fas fa-file-image mr-2 text-sm ${location.pathname === "/admin/banner" ? "opacity-75" : "text-blueGray-300"}`}></i>
                                    Hình nền
                                </Link>
                            </li>
                        </ul>

                        {/* Auth Layout Pages */}
                        <hr className="my-4 md:min-w-full"/>
                        <ul className="md:flex-col md:min-w-full flex flex-col list-none pl-4">
                            <li className="items-center">
                                <Link
                                    className="text-xs uppercase py-3 font-bold block text-blueGray-700 hover:text-blueGray-500"
                                    to="/auth/register"
                                >
                                    <i className="fas fa-sign-out mr-2 text-sm text-blueGray-300"></i>
                                    Đăng xuất
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
}
