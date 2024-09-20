import React from "react";
import "../../../assets/styles/css/style.css";
import "../../../assets/styles/css/bootstrap.min.css";


export default function Footer() {
    return (
        <>
            <footer className="container-fluid footer py-5">
                <div className="container py-5">
                    <div className="row g-5">
                        <div className="col-md-6 col-lg-6 col-xl-3">
                            <div className="footer-item">
                                <h4 className="mb-4 text-white">Bản tin</h4>
                                <p className="text-white">
                                    Mỹ phẩm là các sản phẩm dùng để làm đẹp và chăm sóc cơ thể, bao gồm kem dưỡng, son
                                    môi, phấn nền và nước hoa. Chúng giúp nâng cao vẻ đẹp tự nhiên và che khuyết điểm,
                                    đồng thời ngày càng chú trọng đến an toàn và thành phần tự nhiên, đáp ứng nhu cầu
                                    của người tiêu dùng về sức khỏe và môi trường.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-6 col-xl-3">
                            <div className="footer-item d-flex flex-column">
                                <h4 className="mb-4 text-white">Danh mục sản phẩm</h4>
                                <a href="">
                                    <i className="fas fa-angle-right me-2"></i> Nước Tẩy Trang
                                </a>
                                <a href="">
                                    <i className="fas fa-angle-right me-2"></i> Sữa rửa mặt
                                </a>
                                <a href="">
                                    <i className="fas fa-angle-right me-2"></i> Kem chống nắng
                                </a>
                                <a href="">
                                    <i className="fas fa-angle-right me-2"></i> Kem dưỡng
                                </a>
                                <a href="">
                                    <i className="fas fa-angle-right me-2"></i> Xịt khoáng
                                </a>
                                <a href="">
                                    <i className="fas fa-angle-right me-2"></i> Tẩy da chết
                                </a>
                                <a href="">
                                    <i className="fas fa-angle-right me-2"></i> Son dưỡng
                                </a>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-6 col-xl-3">
                            <div className="footer-item d-flex flex-column">
                                <h4 className="mb-4 text-white">Giờ mở cửa</h4>
                                <p className="text-muted mb-0">
                                    Hằng ngày: <span className="text-white"> 08:00 am – 10:00 pm</span>
                                </p>
                                <h4 className="my-4 text-white">Địa chỉ</h4>
                                <p className="mb-0">
                                    <i className="fas fa-map-marker-alt text-secondary me-2"></i> Toà nhà FPT
                                    Polytechnic, Đ. Số 22, Thường Thạnh, Cái Răng, Cần Thơ
                                </p>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-6 col-xl-3">
                            <div className="footer-item d-flex flex-column">
                                <h4 className="my-4 text-white">Liên hệ chúng tôi</h4>
                                <p className="mb-0">
                                    <i className="fas fa-envelope text-secondary me-2"></i> glowmakers@gmail.com
                                </p>
                                <p className="mb-0">
                                    <i className="fas fa-phone text-secondary me-2"></i> (+012) 3456 7890 123
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            <div className="container-fluid copyright py-4">
                <div className="container">
                    <div className="row g-4 align-items-center">
                        <div className="col-md-4 text-center text-md-start mb-md-0">
              <span className="text-light">
                <a href="#">
                  <i className="fas fa-copyright text-light me-2"></i>Glow Makers
                </a>
                , All right reserved.
              </span>
                        </div>
                        <div className="col-md-4">
                            <div className="d-flex justify-content-center">
                                <a href=""
                                   className="btn btn-light btn-light-outline-0 btn-sm-square rounded-circle me-2">
                                    <i className="fab fa-facebook-f"></i>
                                </a>
                                <a href=""
                                   className="btn btn-light btn-light-outline-0 btn-sm-square rounded-circle me-2">
                                    <i className="fab fa-twitter"></i>
                                </a>
                                <a href=""
                                   className="btn btn-light btn-light-outline-0 btn-sm-square rounded-circle me-2">
                                    <i className="fab fa-instagram"></i>
                                </a>
                                <a href=""
                                   className="btn btn-light btn-light-outline-0 btn-sm-square rounded-circle me-0">
                                    <i className="fab fa-linkedin-in"></i>
                                </a>
                            </div>
                        </div>
                        <div className="col-md-4 text-center text-md-end text-white">
                            Designed By <a className="border-bottom" href="#">Glow Makers</a>
                        </div>
                    </div>
                </div>
            </div>

            <a href="#" className="btn btn-primary btn-primary-outline-0 btn-md-square rounded-circle back-to-top">
                <i className="fa fa-arrow-up"></i>
            </a>
        </>
    );
}