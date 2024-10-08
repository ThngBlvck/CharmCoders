import React from "react";
import "../../../assets/styles/css/style.css";
import "../../../assets/styles/css/bootstrap.min.css";
import {NavLink} from "react-router-dom";


export default function About() {
    return (
        <>
            {/* Breadcrumb */}
            <div className="container-fluid py-3" style={{backgroundColor: "#fff7f8"}}>
                <div className="container text-center py-5">
                    <p className="mb-4 font-semibold" style={{color: "#ffa69e", fontSize: "40px"}}>Giới thiệu</p>
                    <ol className="breadcrumb justify-content-center mb-0">
                        <li className="breadcrumb-item font-bold" style={{color: "#ffa69e"}}><NavLink to={`/home`}>Trang
                            chủ</NavLink></li>
                        <li className="breadcrumb-item active font-bold" style={{color: "#ffa69e"}}>Giới thiệu</li>
                    </ol>
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
                                <p className="fs-4 text-primary font-semibold custom-font">Về Chúng Tôi</p>
                                <p className="mb-4 font-bold" style={{color: '#8c5e58', fontSize: "30px"}}>GlowMakers –
                                    Cửa hàng mỹ phẩm chính hãng.</p>
                                <p className="mb-4" style={{color: '#8c5e58'}}>
                                    GlowMakers là cửa hàng mỹ phẩm chuyên cung cấp các sản phẩm dưỡng da và dưỡng môi
                                    cao cấp, mang lại vẻ đẹp tự nhiên và rạng rỡ cho phái đẹp. Với sứ mệnh giúp bạn tự
                                    tin tỏa sáng, GlowMakers luôn lựa chọn những dòng sản phẩm an toàn, lành tính, chiết
                                    xuất từ thiên nhiên, phù hợp cho mọi loại da. Từ các loại kem dưỡng, serum đến son
                                    dưỡng môi mềm mịn, mỗi sản phẩm tại GlowMakers đều được kiểm tra kỹ lưỡng về chất
                                    lượng, đảm bảo mang đến cho bạn làn da khỏe mạnh và đôi môi căng mọng. Hãy đến với
                                    GlowMakers để khám phá vẻ đẹp tiềm ẩn của chính mình!
                                </p>
                                <p className="mb-4" style={{color: '#8c5e58'}}>
                                    Tại GlowMakers, chúng tôi tin rằng chăm sóc da và môi không chỉ là việc làm đẹp bên
                                    ngoài mà còn là cách bạn nuôi dưỡng sự tự tin và yêu thương bản thân. Chính vì vậy,
                                    GlowMakers không chỉ cung cấp sản phẩm mà còn mang đến những giải pháp chăm sóc da
                                    toàn diện, được tư vấn bởi đội ngũ chuyên gia tận tâm. Dù bạn đang tìm kiếm một quy
                                    trình dưỡng da hàng ngày, giải quyết vấn đề da khô, hay muốn tìm loại son dưỡng môi
                                    hoàn hảo, GlowMakers luôn sẵn sàng đồng hành cùng bạn trong hành trình làm đẹp và
                                    chăm sóc bản thân.
                                </p>
                                <p className="mb-4" style={{color: '#8c5e58'}}>
                                    GlowMakers – Nuôi dưỡng làn da, rạng rỡ nụ cười!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4 ô cam kết */}
            <div className="container py-5 d-flex justify-content-center" style={{fontFamily: 'Roboto, sans-serif'}}>
                {/* Container for Cam kết */}
                <div className="row text-center">
                    {/* Cam kết 1 */}
                    <div className="col-3 d-flex justify-content-center">
                        <div className="p-4 d-flex flex-column align-items-center border border-primary w-100" style={{
                            backgroundColor: '#fff7f8'
                        }}>
                            <img src="https://via.placeholder.com/150x150" alt="Thanh toán khi nhận hàng"
                                 className="img-fluid mb-3 rounded"
                                 style={{width: '150px', objectFit: 'cover'}}/>
                            <p style={{color: '#8c5e58'}} className="font-bold">Thanh toán khi nhận hàng</p>
                        </div>
                    </div>

                    {/* Cam kết 2 */}
                    <div className="col-3 d-flex justify-content-center">
                        <div className="p-4 d-flex flex-column align-items-center border border-primary w-100" style={{
                            backgroundColor: '#fff7f8'
                        }}>
                            <img src="https://via.placeholder.com/150x150" alt="Thương hiệu uy tín toàn cầu"
                                 className="img-fluid mb-3 rounded"
                                 style={{width: '150px', objectFit: 'cover'}}/>
                            <p style={{color: '#8c5e58'}} className="font-bold">Thương hiệu uy tín toàn cầu</p>
                        </div>
                    </div>

                    {/* Cam kết 3 */}
                    <div className="col-3 d-flex justify-content-center">
                        <div className="p-4 d-flex flex-column align-items-center border border-primary w-100" style={{
                            backgroundColor: '#fff7f8'
                        }}>
                            <img src="https://via.placeholder.com/150x150" alt="30 ngày đổi trả miễn phí"
                                 className="img-fluid mb-3 rounded"
                                 style={{width: '150px', objectFit: 'cover'}}/>
                            <p style={{color: '#8c5e58'}} className="font-bold">30 ngày đổi trả miễn phí</p>
                        </div>
                    </div>

                    {/* Cam kết 4 */}
                    <div className="col-3 d-flex justify-content-center">
                        <div className="p-4 d-flex flex-column align-items-center border border-primary w-100" style={{
                            backgroundColor: '#fff7f8'
                        }}>
                            <img src="https://via.placeholder.com/150x150" alt="Sản phẩm chính hãng 100%" className="img-fluid mb-3 rounded"
                                 style={{width: '150px', objectFit: 'cover'}}/>
                            <p style={{color: '#8c5e58'}} className="font-bold">Sản phẩm chính hãng 100%</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
