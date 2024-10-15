import React, {useEffect, useState} from "react";
import "../../../assets/styles/css/style.css";
import "../../../assets/styles/css/bootstrap.min.css";
import {getCategory} from "../../../services/Category";
import {jwtDecode} from "jwt-decode";

export default function Footer() {
    const [categories, setCategories] = useState([]);
    const [showChatModal, setShowChatModal] = useState(false);

    const toggleChatModal = () => {
        setShowChatModal(!showChatModal);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const result = await getCategory();
            setCategories(result);
        } catch (error) {
            console.error("Lỗi khi lấy danh mục sản phẩm:", error);
        }
    };

    return (
        <>
            <footer className="container-fluid footer py-5" style={{backgroundColor: '#fff7f8'}}>
                <div className="container py-5">
                    <div className="row g-5">
                        <div className="col-md-6 col-lg-6 col-xl-3">
                            <div className="footer-item d-flex flex-column">
                                <p className="text-primary font-bold mb-4" style={{fontSize: "40px"}}>GlowMakers</p>
                                <p className="font-bold title" style={{fontSize: '16px', color: '#8c5e58'}}>Liên hệ
                                    chúng tôi</p>
                                <p style={{color: '#8c5e58', fontSize: '14px'}}><i
                                    className="fas fa-envelope me-2"
                                    style={{color: '#ff7e6b', fontSize: '14px'}}></i> glowmakers@gmail.com</p>
                                <p style={{color: '#8c5e58', fontSize: '14px', marginBottom: "1rem"}}><i
                                    className="fas fa-phone me-2"
                                    style={{color: '#ff7e6b', fontSize: '14px'}}></i> (+012)
                                    3456
                                    7890 123</p>
                                <p className="font-bold title" style={{fontSize: '16px', color: '#8c5e58'}}>Chấp nhận
                                    phương thức thanh toán</p>
                                <label className="form-check-label mb-2" style={{color: "#8c5e58"}}>
                                    <i className="fas fa-money-bill fa-2x"></i> Thanh toán khi nhận hàng
                                </label>
                                <label className="form-check-label mb-2" style={{color: "#8c5e58"}}>
                                    <i className="fab fa-cc-visa fa-2x"></i> VNPay
                                </label>
                                <label className="form-check-label mb-2" style={{color: "#8c5e58"}}>
                                    <i className="fab fa-gg-circle fa-2x"></i> Momo
                                </label>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-6 col-xl-3">
                            <div className="footer-item d-flex flex-column">
                                <p className="font-bold title" style={{fontSize: '16px', color: '#8c5e58'}}>Giờ mở
                                    cửa</p>
                                <p style={{color: '#8c5e58', fontSize: '14px', marginBottom: "1rem"}}>Hằng ngày: <span
                                    style={{color: '#8c5e58', fontSize: '14px'}}>08:00 – 22:00</span>
                                </p>
                                <p className="font-bold title" style={{fontSize: '16px', color: '#8c5e58'}}>Địa
                                    chỉ</p>
                                <p style={{color: '#8c5e58', fontSize: '14px'}}><i
                                    className="fas fa-map-marker-alt me-2"
                                    style={{color: '#ff7e6b', fontSize: '14px'}}></i> Toà
                                    nhà FPT Polytechnic, Đ. Số 22, Thường Thạnh, Cái Răng, Cần Thơ</p>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-6 col-xl-3">
                            <div className="footer-item d-flex flex-column">
                                <p className="font-bold title" style={{fontSize: '16px', color: '#8c5e58'}}>Vị trí</p>
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31433.785631967043!2d105.75011124306938!3d9.99841296682619!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a08906415c355f%3A0x416815a99ebd841e!2zVHLGsOG7nW5nIENhbyDEkeG6s25nIEZQVCBQb2x5dGVjaG5pYw!5e0!3m2!1svi!2s!4v1728871294789!5m2!1svi!2s"
                                    width="300" height="300" style={{border: "0"}} allowFullScreen="" loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"></iframe>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-6 col-xl-3">
                            <div className="footer-item">
                                <p className="font-bold title" style={{fontSize: '16px', color: '#8c5e58'}}>Về
                                    GlowMakers</p>
                                <p style={{color: '#8c5e58', fontSize: '14px'}}>
                                    GlowMakers là cửa hàng mỹ phẩm chuyên cung cấp các sản phẩm dưỡng da và dưỡng môi
                                    cao cấp, mang lại vẻ đẹp tự nhiên và rạng rỡ cho phái đẹp. Với sứ mệnh giúp bạn tự
                                    tin tỏa sáng, GlowMakers luôn lựa chọn những dòng sản phẩm an toàn, lành tính, chiết
                                    xuất từ thiên nhiên, phù hợp cho mọi loại da.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            <div className="container-fluid copyright py-4" style={{backgroundColor: '#8c5e58'}}>
                <div className="container">
                    <div className="row g-4 align-items-center d-flex">
                        <div className="col-md-6 text-center text-md-start d-0">
                            <span style={{color: '#fff7f8'}}>
                                <i className="fas fa-copyright me-2" style={{color: '#ff7e6b'}}></i>
                                <a href="#" style={{color: '#fff7f8'}} className="border-bottom">
                                    Glow Makers
                                </a>
                                , All right reserved.
                            </span>
                        </div>

                        <div className="col-md-6 text-center text-md-end" style={{color: '#fff7f8'}}>
                            Designed By <a className="border-bottom" href="#">Glow Makers</a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Back to top button */}
            <a href="#" className="btn btn-primary back-to-top" style={{display: 'none'}}>
                <i className="fas fa-angle-up"></i>
            </a>
        </>
    );
}
