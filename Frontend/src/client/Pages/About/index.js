import React, {useState} from "react";
import "../../../assets/styles/css/style.css";
import "../../../assets/styles/css/bootstrap.min.css";
import { NavLink } from "react-router-dom";
import { sendContactMessage } from '../../../services/Contact'; // Adjust the path as necessary
import { toast } from 'react-toastify';

export default function About() {
    // State to store form data
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });

    // State to store errors (if any)
    const [errors, setErrors] = useState({});

    // Handle form input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Đặt lại lỗi trước đó
        setErrors({});

        // Kiểm tra đơn giản
        const newErrors = {};

        // Kiểm tra nếu tên trống
        if (!formData.name) {
            newErrors.name = "Vui lòng nhập tên.";
        } else if (formData.name.length >= 100) {
            newErrors.name = "Tên không được vượt quá 100 ký tự."; // Kiểm tra chiều dài tên
        }


        // Kiểm tra email với định dạng có đuôi miền 3 ký tự
        if (!formData.email) {
            newErrors.email = "Vui lòng nhập email.";
        } else {
            // Biểu thức chính quy kiểm tra email với đuôi miền 3 ký tự
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{3}$/;
            if (!emailRegex.test(formData.email)) {
                newErrors.email = "Email không hợp lệ."; // Kiểm tra định dạng email
            }
        }

        // Kiểm tra định dạng số điện thoại (chỉ chứa chữ số)
        if (!formData.phone) {
            newErrors.phone = "Vui lòng nhập số điện thoại.";
        } else if (!/^\d{10}$/.test(formData.phone)) {  // Kiểm tra 10 chữ số
            newErrors.phone = "Số điện thoại phải chứa chính xác 10 chữ số."; // Kiểm tra 10 chữ số
        }


        // Kiểm tra nếu tin nhắn trống
        if (!formData.message) {
            newErrors.message = "Vui lòng nhập tin nhắn.";
        } else if (formData.message.length >= 3000) {
            newErrors.message = "Tin nhắn không được vượt quá 3000 ký tự.";
        }

        // Nếu có lỗi, thiết lập lỗi và ngừng gửi dữ liệu
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Gửi tin nhắn nếu không có lỗi
        try {
            await sendContactMessage(formData); // Gọi dịch vụ gửi tin nhắn
            toast.success("Tin nhắn đã được gửi đi.");
            setFormData({ name: "", email: "", phone: "", message: "" }); // Reset form
        } catch (error) {
            console.error("Lỗi khi gửi tin nhắn:", error);
            toast.error("Có lỗi xảy ra trong quá trình gửi tin nhắn.");
        }
    };





    return (
        <>
            <div className="container-fluid about py-5">
                <div className="container py-5">
                    <div className="row g-5 align-items-center shadow rounded">
                        {/* Hình ảnh bên trái */}
                        <div className="col-lg-5">
                            <div className="video">
                                <img src="toner.png" className="img-fluid rounded shadow"/>
                                <div
                                    className="position-absolute rounded border-top border-start border-white bottom-0 right-0">
                                    <img src="toner.png" width={"200px"} className="img-fluid shadow rounded"/>
                                </div>

                            </div>
                        </div>

                        {/* Nội dung giới thiệu */}
                        <div className="col-lg-7">
                            <div>
                                <p className="fs-4 text-dGreen font-semibold">Về Chúng Tôi</p>
                                <p className="mb-4 font-bold text-dGreen fs-30">GlowMakers –
                                    Cửa hàng mỹ phẩm chính hãng.</p>
                                <p className="mb-4 text-dGreen">
                                    GlowMakers là cửa hàng mỹ phẩm chuyên cung cấp các sản phẩm dưỡng da và dưỡng môi
                                    cao cấp, mang lại vẻ đẹp tự nhiên và rạng rỡ cho phái đẹp. Với sứ mệnh giúp bạn tự
                                    tin tỏa sáng, GlowMakers luôn lựa chọn những dòng sản phẩm an toàn, lành tính, chiết
                                    xuất từ thiên nhiên, phù hợp cho mọi loại da. Từ các loại kem dưỡng, serum đến son
                                    dưỡng môi mềm mịn, mỗi sản phẩm tại GlowMakers đều được kiểm tra kỹ lưỡng về chất
                                    lượng, đảm bảo mang đến cho bạn làn da khỏe mạnh và đôi môi căng mọng. Hãy đến với
                                    GlowMakers để khám phá vẻ đẹp tiềm ẩn của chính mình!
                                </p>
                                <p className="mb-4 text-dGreen">
                                    Tại GlowMakers, chúng tôi tin rằng chăm sóc da và môi không chỉ là việc làm đẹp bên
                                    ngoài mà còn là cách bạn nuôi dưỡng sự tự tin và yêu thương bản thân. Chính vì vậy,
                                    GlowMakers không chỉ cung cấp sản phẩm mà còn mang đến những giải pháp chăm sóc da
                                    toàn diện, được tư vấn bởi đội ngũ chuyên gia tận tâm. Dù bạn đang tìm kiếm một quy
                                    trình dưỡng da hàng ngày, giải quyết vấn đề da khô, hay muốn tìm loại son dưỡng môi
                                    hoàn hảo, GlowMakers luôn sẵn sàng đồng hành cùng bạn trong hành trình làm đẹp và
                                    chăm sóc bản thân.
                                </p>
                                <p className="mb-4 text-dGreen">
                                    GlowMakers – Nuôi dưỡng làn da, rạng rỡ nụ cười!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4 ô cam kết */}
            <div className="container py-5 d-flex justify-content-center">
                {/* Container for Cam kết */}
                <div className="row text-center">
                    {/* Cam kết 1 */}
                    <div className="col-3 d-flex justify-content-center">
                        <div className="p-4 d-flex flex-column align-items-center border w-100 greenPt rounded">
                            <img src="hand.png" alt="Thanh toán khi nhận hàng"
                                 className="img-fluid mb-3 rounded"
                                 style={{width: '100px', objectFit: 'cover'}}/>
                            <p className="font-bold text-dGreen">Thanh toán khi nhận hàng</p>
                        </div>
                    </div>

                    {/* Cam kết 2 */}
                    <div className="col-3 d-flex justify-content-center">
                        <div className="p-4 d-flex flex-column align-items-center border w-100 greenPt rounded">
                            <img src="uy-tin.png" alt="Thương hiệu uy tín toàn cầu"
                                 className="img-fluid mb-3 rounded"
                                 style={{width: '100px', objectFit: 'cover'}}/>
                            <p className="font-bold text-dGreen">Thương hiệu uy tín toàn cầu</p>
                        </div>
                    </div>

                    {/* Cam kết 3 */}
                    <div className="col-3 d-flex justify-content-center">
                        <div className="p-4 d-flex flex-column align-items-center border w-100 greenPt rounded">
                            <img src="30days.png" alt="30 ngày đổi trả miễn phí"
                                 className="img-fluid mb-3 rounded"
                                 style={{width: '100px', objectFit: 'cover'}}/>
                            <p className="font-bold text-dGreen">30 ngày đổi trả miễn phí</p>
                        </div>
                    </div>

                    {/* Cam kết 4 */}
                    <div className="col-3 d-flex justify-content-center">
                        <div className="p-4 d-flex flex-column align-items-center border w-100 greenPt rounded">
                            <img src="100.png" alt="Sản phẩm chính hãng 100%"
                                 className="img-fluid mb-3 rounded"
                                 style={{width: '100px', objectFit: 'cover'}}/>
                            <p className="font-bold text-dGreen">Sản phẩm chính hãng 100%</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mx-auto text-center" style={{maxWidth: "800px", marginTop: '100px'}}>
                <p className="fs-4 text-center text-dGreen font-bold">GlowMaker</p>
                <p className="font-bold text-dGreen fs-30">Liên hệ</p>
            </div>
            <div className="container-fluid">
                <div className="container py-5">
                    <div className="row g-4 align-items-center">
                        <div className="col-12">
                            <div className="row g-4">
                                {/* Address Box */}
                                <div className="col-md-4 d-flex justify-content-center">
                                    <div
                                        className="d-inline-flex flex-column align-items-center bg-light w-100 border border-green p-4 rounded"
                                        style={{minHeight: "200px"}}>
                                        <i className="fas fa-map-marker-alt fa-2x text-dGreen mb-3"></i>
                                        <div>
                                            <p className="text-center mb-3 text-dGreen">Địa chỉ</p>
                                            <p className="mb-0 text-center text-dGreen">Toà nhà FPT
                                                Polytechnic, Đ. Số 22, Thường
                                                Thạnh, Cái Răng, Cần Thơ</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Email Box */}
                                <div className="col-md-4 d-flex justify-content-center">
                                    <div
                                        className="d-inline-flex flex-column align-items-center bg-light w-100 border border-green p-4 rounded"
                                        style={{minHeight: "200px"}}>
                                        <i className="fas fa-envelope fa-2x text-dGreen mb-3"></i>
                                        <div>
                                            <p className="text-center mb-3 text-dGreen">Email</p>
                                            <p className="mb-0 text-center text-dGreen">glowmakers@gmail.com</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Phone Number Box */}
                                <div className="col-md-4 d-flex justify-content-center">
                                    <div
                                        className="d-inline-flex flex-column align-items-center bg-light w-100 border border-green p-4 rounded"
                                        style={{minHeight: "200px"}}>
                                        <i className="fas fa-phone fa-2x text-dGreen mb-3"></i>
                                        <div>
                                            <p className="text-center mb-3 text-dGreen">Số điện thoại</p>
                                            <p className="mb-0 text-center text-dGreen">0123456789</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container-fluid py-5" style={{backgroundColor: "white", marginTop: "2rem"}}>
                <div className="container greenPt pt-1 shadow rounded">
                    <div className="row g-4 align-items-center">
                        <div className="col-lg-6">
                            <div className="text-center">
                                <p className="text-dGreen mb-4 font-bold fs-30">Liên hệ với
                                    GlowMakers</p>
                                <p className="text-dGreen font-semibold fs-20">Bạn có thắc mắc hay
                                    đóng góp, vui lòng liên hệ với chúng tôi bằng cách điền thông tin vào form bên
                                    cạnh.</p>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="rounded p-5">
                                <form onSubmit={handleSubmit}>
                                    <div className="row gx-4 gy-3">
                                        <div className="col-xl-12">
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="form-control bg-white border-0 py-3 px-4 rounded"
                                                placeholder="Nhập tên..."
                                            />
                                            {errors.name && <small className="text-danger">{errors.name}</small>}
                                        </div>
                                        <div className="col-xl-12">
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="form-control bg-white border-0 py-3 px-4 rounded"
                                                placeholder="Nhập email..."
                                            />
                                            {errors.email && <small className="text-danger">{errors.email}</small>}
                                        </div>
                                        <div className="col-xl-12">
                                            <input
                                                type="text"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="form-control bg-white border-0 py-3 px-4 rounded"
                                                placeholder="Nhập số điện thoại..."
                                            />
                                            {errors.phone && <small className="text-danger">{errors.phone}</small>}
                                        </div>
                                        <div className="col-12">
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                className="form-control bg-white border-0 py-3 px-4"
                                                rows="4"
                                                cols="10"
                                                placeholder="Nhập tin nhắn..."
                                            ></textarea>
                                            {errors.message && <small className="text-danger">{errors.message}</small>}
                                        </div>
                                        <div className="col-12 d-flex justify-center">
                                            <button className="butn w-40 py-3 px-5 font-semibold rounded shadow"
                                                    type="submit">
                                                Gửi
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="col-md-12 col-lg-12 col-xl-12">
                <div className="d-flex flex-column">
                    <div className="mx-auto text-center" style={{maxWidth: "800px", marginTop: '100px'}}>
                        <p className="text-center text-dGreen font-bold fs-30 mb-2">Vị trí cửa hàng</p>
                    </div>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31433.785631967043!2d105.75011124306938!3d9.99841296682619!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a08906415c355f%3A0x416815a99ebd841e!2zVHLGsOG7nW5nIENhbyDEkeG6s25nIEZQVCBQb2x5dGVjaG5pYw!5e0!3m2!1svi!2s!4v1728871294789!5m2!1svi!2s"
                        width="100%" height="500px" allowFullScreen="" loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade" className="shadow rounded border-0 mb-4"></iframe>
                </div>
            </div>
        </>
    );
}
