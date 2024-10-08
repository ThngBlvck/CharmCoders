import React, { useState } from "react";
import "../../../assets/styles/css/style.css";
import "../../../assets/styles/css/bootstrap.min.css";
import { NavLink } from "react-router-dom";

export default function Products() {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [priceFilter, setPriceFilter] = useState("all");
    const [brandFilter, setBrandFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);

    const products = [
        { id: 1, name: "Product 1", price: 500000, category: "Skin Care", brand: "Brand A" },
        { id: 2, name: "Product 2", price: 150000, category: "Hair Care", brand: "Brand B" },
        { id: 3, name: "Product 3", price: 800000, category: "Body Care", brand: "Brand C" },
        { id: 4, name: "Product 4", price: 120000, category: "Nail Care", brand: "Brand A" },
        { id: 5, name: "Product 5", price: 400000, category: "Skin Care", brand: "Brand B" },
        { id: 6, name: "Product 6", price: 300000, category: "Hair Care", brand: "Brand C" },
        { id: 7, name: "Product 7", price: 90000, category: "Body Care", brand: "Brand A" },
        { id: 8, name: "Product 8", price: 200000, category: "Nail Care", brand: "Brand B" },
        { id: 9, name: "Product 9", price: 130000, category: "Skin Care", brand: "Brand A" },
        { id: 10, name: "Product 10", price: 170000, category: "Hair Care", brand: "Brand B" },
        { id: 11, name: "Product 11", price: 500000, category: "Body Care", brand: "Brand C" },
        { id: 12, name: "Product 12", price: 130000, category: "Nail Care", brand: "Brand A" },
        { id: 13, name: "Product 13", price: 450000, category: "Skin Care", brand: "Brand B" },
        { id: 14, name: "Product 14", price: 350000, category: "Hair Care", brand: "Brand C" },
        { id: 15, name: "Product 15", price: 920000, category: "Body Care", brand: "Brand A" },
        { id: 16, name: "Product 16", price: 230000, category: "Nail Care", brand: "Brand B" }
    ];

    const productsPerPage = 12;

    // Bộ lọc sản phẩm
    const filteredProducts = products
        .filter(product => selectedCategory === "all" || product.category === selectedCategory)
        .filter(product => {
            if (priceFilter === "low") return product.price < 100000;
            if (priceFilter === "high") return product.price >= 100000;
            return true;
        })
        .filter(product => brandFilter === "all" || product.brand === brandFilter);

    // Tính toán pagination
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    // Khi thay đổi bộ lọc, đặt lại currentPage về 1 để tránh lỗi không hiển thị đúng sản phẩm
    const handleFilterChange = (setter) => (e) => {
        setter(e.target.value);
        setCurrentPage(1);
    };

    return (
        <>
            {/* Breadcrumb */}
            <div className="container-fluid py-3" style={{ backgroundColor: "#fff7f8" }}>
                <div className="container text-center py-5">
                    <p className="mb-4 font-semibold" style={{ color: "#ffa69e", fontSize: "40px" }}>
                        Sản phẩm
                    </p>
                    <ol className="breadcrumb justify-content-center mb-0">
                        <li className="breadcrumb-item font-bold" style={{ color: "#ffa69e" }}>
                            <NavLink to={`/home`}>Trang chủ</NavLink>
                        </li>
                        <li className="breadcrumb-item active font-bold" style={{ color: "#ffa69e" }}>
                            Sản phẩm
                        </li>
                    </ol>
                </div>
            </div>

            {/* Bộ lọc sản phẩm */}
            <div className="container py-4">
                <div className="row">
                    {/* Danh mục */}
                    <div className="col-md-4 mb-3">
                        <p style={{ fontSize: "20px", color: "#8c5e58" }} className="font-bold">
                            Danh mục sản phẩm
                        </p>
                        <select
                            className="form-select"
                            value={selectedCategory}
                            onChange={handleFilterChange(setSelectedCategory)}
                        >
                            <option value="all" style={{ color: "#8c5e58" }}>
                                Tất cả
                            </option>
                            <option value="Skin Care" style={{ color: "#8c5e58" }}>
                                Skin Care
                            </option>
                            <option value="Hair Care" style={{ color: "#8c5e58" }}>
                                Hair Care
                            </option>
                            <option value="Body Care" style={{ color: "#8c5e58" }}>
                                Body Care
                            </option>
                            <option value="Nail Care" style={{ color: "#8c5e58" }}>
                                Nail Care
                            </option>
                        </select>
                    </div>

                    {/* Lọc theo giá */}
                    <div className="col-md-4 mb-3">
                        <p style={{ fontSize: "20px", color: "#8c5e58" }} className="font-bold">
                            Lọc theo giá
                        </p>
                        <select
                            className="form-select"
                            value={priceFilter}
                            onChange={handleFilterChange(setPriceFilter)}
                        >
                            <option value="all" style={{ color: "#8c5e58" }}>
                                Tất cả
                            </option>
                            <option value="low" style={{ color: "#8c5e58" }}>
                                Dưới 100.000đ
                            </option>
                            <option value="high" style={{ color: "#8c5e58" }}>
                                Từ 100.000đ trở lên
                            </option>
                        </select>
                    </div>

                    {/* Lọc theo thương hiệu */}
                    <div className="col-md-4 mb-3">
                        <p style={{ fontSize: "20px", color: "#8c5e58" }} className="font-bold">
                            Lọc theo thương hiệu
                        </p>
                        <select
                            className="form-select"
                            value={brandFilter}
                            onChange={handleFilterChange(setBrandFilter)}
                        >
                            <option value="all" style={{ color: "#8c5e58" }}>
                                Tất cả
                            </option>
                            <option value="Brand A" style={{ color: "#8c5e58" }}>
                                Brand A
                            </option>
                            <option value="Brand B" style={{ color: "#8c5e58" }}>
                                Brand B
                            </option>
                            <option value="Brand C" style={{ color: "#8c5e58" }}>
                                Brand C
                            </option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Hiển thị sản phẩm */}
            <div className="container">
                <div className="row">
                    {currentProducts.map((product) => (
                        <div key={product.id} className="col-md-6 col-lg-3 mb-4">
                            <div className="card text-center bg-hover" style={{ borderRadius: "15px", padding: "20px" }}>
                                <NavLink to={`/products/${product.id}`}>
                                    <img
                                        src="https://via.placeholder.com/500"
                                        className="card-img-top img-fluid rounded"
                                        alt="Product"
                                        style={{ maxHeight: "500px", objectFit: "cover" }}
                                    />
                                </NavLink>
                                <div className="card-body">
                                    <NavLink to={`/products/${product.id}`} className="text-decoration-none">
                                        <p className="card-title font-semibold" style={{ color: '#8c5e58' }}>
                                            {product.name}
                                        </p>
                                    </NavLink>
                                    <p className="card-text mb-4 font-semibold" style={{ color: '#8c5e58' }}>
                                        {product.price.toLocaleString("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                        })}
                                    </p>

                                    <NavLink to={`/products/${product.id}`} className="w-100">
                                        <button className="btn btn-primary mr-2 font-bold w-100" style={{
                                            padding: '14px',
                                            fontSize: '13px',
                                            color: '#442e2b'
                                        }}><p>Xem chi tiết</p></button>
                                    </NavLink>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <nav>
                    <ul className="pagination pagination-custom">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <li key={index + 1} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                                <button
                                    className="page-link"
                                    onClick={() => setCurrentPage(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

        </>
    );
}
