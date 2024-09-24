import React from "react";
import "../../../assets/styles/css/style.css";
import "../../../assets/styles/css/bootstrap.min.css";
import {NavLink} from "react-router-dom";


export default function Home() {
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

    return (
        <>
            <div className="container-fluid services py-1 d-flex">
                <div className="container py-5">
                    <div className="mx-auto text-center mb-5" style={{maxWidth: "800px"}}>
                        <p className="fs-4 text-uppercase text-center text-primary">Glow Makers</p>
                        <p className="display-3" style={{color: '#8c5e58'}}>Các sản phẩm mới nhất</p>
                    </div>
                    <div className="row g-4">
                        <div className="row">
                            {products.map((product) => (
                                <div key={product.id} className="col-md-6 col-lg-3 mb-3">
                                    <div className="card text-center" style={{borderRadius: '15px', padding: '20px'}}>
                                        <NavLink to={`/products/:id`}>
                                            <img
                                                src="https://via.placeholder.com/500"
                                                className="card-img-top img-fluid rounded"
                                                alt="Product"
                                                style={{maxHeight: '500px', objectFit: 'cover'}}
                                            />
                                        </NavLink>
                                        <div className="card-body">
                                            <NavLink to={`/products/:id`}><p className="card-title font-semibold"
                                                                             style={{color: '#8c5e58'}}>{product.name}</p>
                                            </NavLink>
                                            <p className="card-text mb-4 font-semibold"
                                               style={{color: '#8c5e58'}}>{product.price}đ</p>

                                            <NavLink to={`/products/:id`} onClick={() => window.scrollTo(0, 0)} className="w-100">
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

                    </div>
                </div>
            </div>

            <div className="container-fluid about py-5">
                <div className="container py-5">
                    <div className="row g-5 align-items-center">
                        {/* Hình ảnh bên trái */}
                        <div className="col-lg-5">
                            <div className="video">
                                <img src="https://via.placeholder.com/400x300" className="img-fluid rounded"
                                     alt="About Us"/>
                                <div className="position-absolute rounded border-5 border-top border-start border-white"
                                     style={{bottom: '0', right: '0'}}>
                                    <img src="https://via.placeholder.com/200x150" className="img-fluid rounded"
                                         alt="Extra Image"/>
                                </div>

                            </div>
                        </div>

                        {/* Nội dung giới thiệu */}
                        <div className="col-lg-7">
                            <div>
                                <p className="fs-4 text-uppercase text-primary">About Us</p>
                                <p className="display-4 mb-4" style={{color: '#8c5e58'}}>Your Best Spa, Beauty & Skin
                                    Care
                                    Center</p>
                                <p className="mb-4" style={{color: '#8c5e58'}}>
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                                </p>
                                <p className="mb-4" style={{color: '#8c5e58'}}>
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                                </p>
                                <NavLink to={`/about`}
                                         className="btn btn-primary btn-primary-outline-0 rounded-pill py-3 px-5">
                                    Xem thêm
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4 ô cam kết */}
            <div className="container py-2 d-flex justify-content-center" style={{fontFamily: 'Roboto, sans-serif'}}>
                {/* Container for Cam kết */}
                <div className="row text-center">
                    {/* Cam kết 1 */}
                    <div className="col-3 d-flex justify-content-center">
                        <div className="p-4 d-flex flex-column align-items-center" style={{
                            backgroundColor: 'white'
                        }}>
                            <img src="https://via.placeholder.com/150x150" alt="Thanh toán khi nhận hàng"
                                 className="img-fluid mb-3"
                                 style={{width: '150px', objectFit: 'cover'}}/>
                            <p style={{color: '#8c5e58'}} className="font-bold">Thanh toán khi nhận hàng</p>
                        </div>
                    </div>

                    {/* Cam kết 2 */}
                    <div className="col-3 d-flex justify-content-center">
                        <div className="p-4 d-flex flex-column align-items-center" style={{
                            backgroundColor: 'white'
                        }}>
                            <img src="https://via.placeholder.com/150x150" alt="Giao nhanh miễn phí 2H"
                                 className="img-fluid mb-3"
                                 style={{width: '150px', objectFit: 'cover'}}/>
                            <p style={{color: '#8c5e58'}} className="font-bold">Giao nhanh miễn phí 2H</p>
                        </div>
                    </div>

                    {/* Cam kết 3 */}
                    <div className="col-3 d-flex justify-content-center">
                        <div className="p-4 d-flex flex-column align-items-center" style={{
                            backgroundColor: 'white'
                        }}>
                            <img src="https://via.placeholder.com/150x150" alt="30 ngày đổi trả miễn phí"
                                 className="img-fluid mb-3"
                                 style={{width: '150px', objectFit: 'cover'}}/>
                            <p style={{color: '#8c5e58'}} className="font-bold">30 ngày đổi trả miễn phí</p>
                        </div>
                    </div>

                    {/* Cam kết 4 */}
                    <div className="col-3 d-flex justify-content-center">
                        <div className="p-4 d-flex flex-column align-items-center" style={{
                            backgroundColor: 'white'
                        }}>
                            <img src="https://via.placeholder.com/150x150" alt="Tư vấn 24/7" className="img-fluid mb-3"
                                 style={{width: '150px', objectFit: 'cover'}}/>
                            <p style={{color: '#8c5e58'}} className="font-bold">Tư vấn 24/7</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto text-center" style={{maxWidth: "800px", marginTop: '100px'}}>
                <p className="fs-4 text-uppercase text-center text-primary">Glow Makers</p>
                <p className="display-3" style={{color: '#8c5e58'}}>Liên hệ</p>
            </div>
            <div className="container-fluid">
                <div className="container py-5">
                    <div className="row g-4 align-items-center">
                        <div className="col-12">
                            <div className="row g-4">
                                {/* Ô Địa chỉ */}
                                <div className="col-md-4 d-flex justify-content-center">
                                    <div
                                        className="d-inline-flex flex-column align-items-center bg-light w-100 border border-primary p-4 rounded"
                                        style={{minHeight: "200px"}}>
                                        <i className="fas fa-map-marker-alt fa-2x text-primary mb-3"></i>
                                        <div>
                                            <p className="text-center mb-3" style={{color: '#8c5e58'}}>Địa chỉ</p>
                                            <p className="mb-0 text-center" style={{color: '#8c5e58'}}>Toà nhà FPT
                                                Polytechnic, Đ. Số 22, Thường
                                                Thạnh, Cái Răng, Cần Thơ</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Ô Email */}
                                <div className="col-md-4 d-flex justify-content-center">
                                    <div
                                        className="d-inline-flex flex-column align-items-center bg-light w-100 border border-primary p-4 rounded"
                                        style={{minHeight: "200px"}}>
                                        <i className="fas fa-envelope fa-2x text-primary mb-3"></i>
                                        <div>
                                            <p className="text-center mb-3" style={{color: '#8c5e58'}}>Email</p>
                                            <p className="mb-0 text-center"
                                               style={{color: '#8c5e58'}}>glowmakers@gmail.com</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Ô Số điện thoại */}
                                <div className="col-md-4 d-flex justify-content-center">
                                    <div
                                        className="d-inline-flex flex-column align-items-center bg-light w-100 border border-primary p-4 rounded"
                                        style={{minHeight: "200px"}}>
                                        <i className="fa fa-phone-alt fa-2x text-primary mb-3"></i>
                                        <div>
                                            <p className="text-center mb-3" style={{color: '#8c5e58'}}>Số điện thoại</p>
                                            <p className="mb-0 text-center" style={{color: '#8c5e58'}}>(+012) 3456 7890
                                                123</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </>
    );
}
