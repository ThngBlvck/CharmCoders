import React from "react";
import "../../../assets/styles/css/style.css";
import "../../../assets/styles/css/bootstrap.min.css";


export default function Footer() {
    return (
        <>
            <footer className="container-fluid footer py-5" style={{backgroundColor: '#fff7f8'}}>
                <div className="container py-5">
                    <div className="row g-5">
                        <div className="col-md-6 col-lg-6 col-xl-3">
                            <div className="footer-item">
                                <p className="mb-2 font-bold title" style={{fontSize: '20px', color: '#8c5e58'}}>Bản tin</p>
                                <p style={{color: '#8c5e58'}}>
                                    Mỹ phẩm là các sản phẩm dùng để làm đẹp và chăm sóc cơ thể, bao gồm kem dưỡng, son
                                    môi, phấn nền và nước hoa. Chúng giúp nâng cao vẻ đẹp tự nhiên và che khuyết điểm,
                                    đồng thời ngày càng chú trọng đến an toàn và thành phần tự nhiên, đáp ứng nhu cầu
                                    của người tiêu dùng về sức khỏe và môi trường.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-6 col-xl-3">
                            <div className="footer-item d-flex flex-column">
                                <p className="mb-2 font-bold title" style={{fontSize: '20px', color: '#8c5e58'}}>Danh mục sản
                                    phẩm</p>
                                <a href="" style={{color: '#8c5e58'}}><i className="fas fa-angle-right me-2" style={{color: '#8c5e58'}}></i> Nước Tẩy Trang</a>
                                <a href="" style={{color: '#8c5e58'}}><i className="fas fa-angle-right me-2" style={{color: '#8c5e58'}}></i> Sữa rửa mặt</a>
                                <a href="" style={{color: '#8c5e58'}}><i className="fas fa-angle-right me-2" style={{color: '#8c5e58'}}></i> Kem chống nắng</a>
                                <a href="" style={{color: '#8c5e58'}}><i className="fas fa-angle-right me-2" style={{color: '#8c5e58'}}></i> Kem dưỡng</a>
                                <a href="" style={{color: '#8c5e58'}}><i className="fas fa-angle-right me-2" style={{color: '#8c5e58'}}></i> Xịt khoáng</a>
                                <a href="" style={{color: '#8c5e58'}}><i className="fas fa-angle-right me-2" style={{color: '#8c5e58'}}></i> Tẩy da chết</a>
                                <a href="" style={{color: '#8c5e58'}}><i className="fas fa-angle-right me-2" style={{color: '#8c5e58'}}></i> Son dưỡng</a>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-6 col-xl-3">
                            <div className="footer-item d-flex flex-column">
                                <p className="mb-2 font-bold title" style={{fontSize: '20px', color: '#8c5e58'}}>Giờ mở cửa</p>
                                <p className="text-muted mb-4" style={{color: '#8c5e58'}}>Hằng ngày: <span style={{color: '#8c5e58'}}>08:00 am – 10:00 pm</span>
                                </p>
                                <p className="mb-2 font-bold title" style={{fontSize: '20px', color: '#8c5e58'}}>Địa chỉ</p>
                                <p className="mb-0" style={{color: '#8c5e58'}}><i className="fas fa-map-marker-alt me-2" style={{color: '#ff7e6b'}}></i> Toà
                                    nhà FPT Polytechnic, Đ. Số 22, Thường Thạnh, Cái Răng, Cần Thơ</p>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-6 col-xl-3">
                            <div className="footer-item d-flex flex-column">
                                <p className="mb-2 font-bold title" style={{fontSize: '20px', color: '#8c5e58'}}>Liên hệ chúng
                                    tôi</p>
                                <p className="mb-0" style={{color: '#8c5e58'}}><i
                                    className="fas fa-envelope me-2" style={{color: '#ff7e6b'}}></i> glowmakers@gmail.com</p>
                                <p className="mb-0" style={{color: '#8c5e58'}}><i className="fas fa-phone me-2" style={{color: '#ff7e6b'}}></i> (+012) 3456
                                    7890 123</p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            <div className="container-fluid copyright py-4" style={{backgroundColor: '#8c5e58'}}>
                <div className="container">
                    <div className="row g-4 align-items-center d-flex">
                        <div className="col-md-6 text-center text-md-start mb-md-0">
                          <span style={{color: '#fff7f8'}}>
                            <a href="#" style={{color: '#fff7f8'}}>
                              <i className="fas fa-copyright me-2"  style={{color: '#ff7e6b'}}></i>Glow Makers
                            </a>
                            , All right reserved.
                          </span>
                        </div>

                        <div className="col-md-6 text-center text-md-end"  style={{color: '#fff7f8'}}>
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