import React, {useState} from "react";
import "../../../assets/styles/css/style.css";
import "../../../assets/styles/css/bootstrap.min.css";


export default function Products() {
    // State cho danh mục, giá và thương hiệu lọc
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [priceFilter, setPriceFilter] = useState('all');
    const [brandFilter, setBrandFilter] = useState('all'); // Thêm state cho thương hiệu
    const [currentPage, setCurrentPage] = useState(1);

    // Demo sản phẩm
    const products = [
        {id: 1, name: "Product 1", price: 50, category: "Skin Care", brand: "Brand A"},
        {id: 2, name: "Product 2", price: 150, category: "Hair Care", brand: "Brand B"},
        {id: 3, name: "Product 3", price: 80, category: "Body Care", brand: "Brand C"},
        {id: 4, name: "Product 4", price: 120, category: "Nail Care", brand: "Brand A"},
        {id: 5, name: "Product 5", price: 40, category: "Skin Care", brand: "Brand B"},
        {id: 6, name: "Product 6", price: 300, category: "Hair Care", brand: "Brand C"},
        {id: 7, name: "Product 7", price: 90, category: "Body Care", brand: "Brand A"},
        {id: 8, name: "Product 8", price: 200, category: "Nail Care", brand: "Brand B"}
    ];

    const productsPerPage = 4; // Số sản phẩm trên mỗi trang

    // Hàm lọc sản phẩm dựa trên danh mục, giá và thương hiệu
    const filteredProducts = products
        .filter(product => (selectedCategory === 'all' || product.category === selectedCategory))
        .filter(product => {
            if (priceFilter === 'low') return product.price < 100;
            if (priceFilter === 'high') return product.price >= 100;
            return true;
        })
        .filter(product => (brandFilter === 'all' || product.brand === brandFilter)); // Thêm lọc theo thương hiệu

    // Phân trang
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);


    return (
        <>
            {/* Breadcrumb */}
            <div className="container-fluid bg-breadcrumb py-5">
                <div className="container text-center py-5">
                    <h1 className="text-white display-3 mb-4">Sản phẩm</h1>
                    <ol className="breadcrumb justify-content-center mb-0">
                        <li className="breadcrumb-item"><a href="#">Trang chủ</a></li>
                        <li className="breadcrumb-item active text-white">Sản phẩm</li>
                    </ol>
                </div>
            </div>

            {/* Danh mục sản phẩm, lọc theo giá và thương hiệu */}
            <div className="container py-5">
                <div className="row">
                    <div className="col-lg-3">
                        {/* Danh mục */}
                        <div className="mb-4">
                            <h5>Danh mục sản phẩm</h5>
                            <select
                                className="form-select"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="all">Tất cả</option>
                                <option value="Skin Care">Nước tẩy trang</option>
                                <option value="Hair Care">Sữa rửa mặt</option>
                                <option value="Body Care">Kem chống nắng</option>
                                <option value="Nail Care">Son dưỡng</option>
                            </select>
                        </div>

                        {/* Lọc theo giá */}
                        <div className="mb-4">
                            <h5>Lọc theo giá</h5>
                            <select
                                className="form-select"
                                value={priceFilter}
                                onChange={(e) => setPriceFilter(e.target.value)}
                            >
                                <option value="all">Tất cả</option>
                                <option value="low">Dưới 200.000đ</option>
                                <option value="high">Từ 200.000đ trở lên</option>
                            </select>
                        </div>

                        {/* Lọc theo thương hiệu */}
                        <div className="mb-4">
                            <h5>Lọc theo thương hiệu</h5>
                            <select
                                className="form-select"
                                value={brandFilter}
                                onChange={(e) => setBrandFilter(e.target.value)}
                            >
                                <option value="all">Tất cả</option>
                                <option value="Brand A">Brand A</option>
                                <option value="Brand B">Brand B</option>
                                <option value="Brand C">Brand C</option>
                            </select>
                        </div>
                    </div>

                    {/* Hiển thị sản phẩm */}
                    <div className="col-lg-9">
                        <div className="row">
                            {currentProducts.map((product) => (
                                <div key={product.id} className="col-md-6 col-lg-3 mb-4">
                                    <div className="card text-center" style={{borderRadius: '15px', padding: '20px'}}>
                                        <img
                                            src="https://via.placeholder.com/300"
                                            className="card-img-top img-fluid rounded"
                                            alt="Product"
                                            style={{maxHeight: '200px', objectFit: 'cover'}}
                                        />
                                        <div className="card-body">
                                            <h3 className="card-title">{product.name}</h3>
                                            <p className="card-text">{product.price}đ</p>
                                            <div className="d-flex justify-content-between">
                                                <button className="btn btn-primary">Mua ngay</button>
                                                <button className="btn btn-secondary">Thêm vào giỏ</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Phân trang */}
                        <div className="d-flex justify-content-end mt-4">
                            <nav>
                                <ul className="pagination">
                                    {Array.from({length: totalPages}, (_, index) => (
                                        <li key={index}
                                            className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                            <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
                                                {index + 1}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
