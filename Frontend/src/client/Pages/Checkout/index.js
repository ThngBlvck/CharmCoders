import React, {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {makeMomoPayment} from '../../../services/Product'; // Import service
import {getCartsByIds} from '../../../services/Cart';
import {getProductsByIds} from "../../../services/Product";
import "../../../assets/styles/css/bootstrap.min.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import {getUserInfo} from "../../../services/User";
import {checkout,momoCheckout} from '../../../services/Checkout';
import axios from "axios";
import Swal from "sweetalert2";

export default function Checkout() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        paymentMethod: "cashOnDelivery", // Mặc định là thanh toán khi nhận hàng
    });
    const {cartIds} = useParams();
    const [products, setProducts] = useState([]);
    const location = useLocation();
    const [loading, setLoading] = useState(false); // Thêm state loading
    const queryParams = new URLSearchParams(location.search);

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");
    const [provinceName, setProvinceName] = useState("");
    const [districtName, setDistrictName] = useState("");
    const [wardName, setWardName] = useState("");

    const [address, setAddress] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            console.log("Payload từ token:", payload); // Xem toàn bộ payload

            // Gọi fetchUserInfo để lấy thông tin người dùng
            fetchUserInfo().then(userInfo => {
                console.log("Thông tin người dùng:", userInfo); // Xem thông tin người dùng đã nhận

                if (userInfo && typeof userInfo === 'object' && userInfo.user_id) {
                    // Kiểm tra userInfo có phải là một đối tượng và có user_id
                    setFormData(prevFormData => ({
                        ...prevFormData,
                        name: userInfo.name || "",
                        email: userInfo.email || "",
                        phone: userInfo.phone || "",
                    }));
                } else {
                    console.warn("Không có thông tin người dùng hợp lệ.");
                }
            });
        } else {
            console.error("Không tìm thấy token trong localStorage.");
        }
        const cartIds = queryParams.get('cartIds')?.split(',') || [];
        if (cartIds.length > 0) {
            fetchCartsByIds(cartIds);
        }
    }, [location.search]);

    // Lấy danh sách tỉnh khi component được mount
    useEffect(() => {
        axios.get("https://provinces.open-api.vn/api/p/")
            .then(response => {
                setProvinces(response.data);
            })
            .catch(error => {
                console.error("Error fetching provinces:", error);
            });
    }, []);

    useEffect(() => {
        if (selectedProvince) {
            axios.get(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
                .then(response => {
                    setDistricts(response.data.districts);
                    setWards([]); // Xóa danh sách xã khi thay đổi tỉnh
                    setSelectedDistrict("");
                    setSelectedWard("");

                    // Cập nhật tên tỉnh
                    setProvinceName(response.data.name); // Lưu tên tỉnh

                    console.log("Districts:", response.data.district); // Kiểm tra danh sách districts
                })
                .catch(error => {
                    console.error("Error fetching districts:", error);
                });
        }
    }, [selectedProvince]);

    // Lấy danh sách xã khi chọn huyện
    useEffect(() => {
        if (selectedDistrict) {
            axios.get(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`)
                .then(response => {
                    setWards(response.data.wards);
                    setSelectedWard("");

                    setDistrictName(response.data.name);

                    // Cập nhật tên xã/phường đầu tiên trong danh sách (nếu có)
                    if (response.data.wards.length > 0) {
                        setWardName(response.data.wards[0].name); // Lưu tên xã/phường đầu tiên
                    }
                })
                .catch(error => {
                    console.error("Error fetching wards:", error);
                });
        }
    }, [selectedDistrict]);


    // Hàm xử lý thay đổi các giá trị trong form
    const handleProvinceChange = (e) => {
        const selectedProvince = e.target.value;
        setSelectedProvince(selectedProvince);

        // Tìm tên huyện dựa trên id hoặc value
        const selectedProvinceObj = provinces.find(province => province.code === selectedProvince);
        if (selectedProvinceObj) {
            setProvinceName(selectedProvinceObj.name); // Cập nhật tên tỉnh
        }
    };

    const handleDistrictChange = (e) => {
        const selectedDistrict = e.target.value;
        setSelectedDistrict(selectedDistrict);

        console.log("Selected District:", selectedDistrict); // Kiểm tra giá trị này
        console.log("Districts:", districts); // Kiểm tra danh sách districts
        const selectedDistrictObj = districts.find(district => district.code === selectedDistrict);
        if (selectedDistrictObj) {
            setDistrictName(selectedDistrictObj.name); // Cập nhật tên huyện
        } else {
            setDistrictName(""); // Đặt lại tên huyện nếu không tìm thấy
        }
    };

    const handleWardChange = (event) => {
        const selectedWard = event.target.value;
        setSelectedWard(selectedWard);

        // Tìm tên xã/phường dựa trên id hoặc value
        const selectedWardObj = wards.find(ward => ward.code === selectedWard);
        if (selectedWardObj) {
            setWardName(selectedWardObj.name); // Cập nhật tên xã/phường
        }
    };

    const fetchCartsByIds = async (cartIds) => {
        setLoading(true); // Bật trạng thái loading
        try {
            console.log("Fetching carts with IDs:", cartIds);
            const cartResult = await getCartsByIds(cartIds);
            const cartItems = cartResult.cart_items; // Truy cập các mục giỏ hàng từ `cart_items`

            if (Array.isArray(cartItems) && cartItems.length > 0) {
                // Chỉ giữ lại các mục giỏ hàng có cartId khớp với các cartIds từ URL
                const filteredCartItems = cartItems.filter(cart => cartIds.includes(cart.id.toString()));

                const productIds = filteredCartItems.map(cart => cart.product_id);
                console.log("Filtered Product IDs:", productIds);

                const productResults = await getProductsByIds(productIds); // Lấy thông tin sản phẩm

                if (Array.isArray(productResults) && productResults.length > 0) {
                    const combinedProducts = filteredCartItems.map(cart => {
                        const product = productResults.find(p => p.id === cart.product_id);
                        if (product) {
                            return {
                                ...product,
                                quantity: cart.quantity
                            };
                        }
                        return null; // Trả về null nếu không tìm thấy sản phẩm
                    }).filter(item => item !== null); // Loại bỏ các sản phẩm null

                    setProducts(combinedProducts);
                } else {
                    console.error("Không tìm thấy sản phẩm nào.");
                    setProducts([]);
                }
            } else {
                console.error("Không tìm thấy giỏ hàng nào.");
                setProducts([]);
            }
        } catch (error) {
            console.error("Lỗi khi lấy sản phẩm:", error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const calculateTotal = () => {
        if (!Array.isArray(products) || products.length === 0) {
            return 0; // Trả về 0 nếu không phải là mảng hoặc mảng rỗng
        }
        return products.reduce((total, item) => total + (item.unit_price * item.quantity), 0);
    };

    const total = (item) => {
        return item.unit_price * item.quantity;
    };

    const fetchUserInfo = async () => {
        try {
            const response = await getUserInfo(); // Gọi API để lấy thông tin người dùng
            console.log("Đáp ứng từ API:", response); // Kiểm tra dữ liệu từ API

            if (response && response.user_id) {
                return response; // Trả về dữ liệu người dùng
            } else {
                console.error("Không có dữ liệu người dùng từ API.");
                return {}; // Trả về đối tượng rỗng nếu không có dữ liệu
            }
        } catch (error) {
            console.error("Lỗi khi lấy thông tin người dùng:", error);
            return {}; // Trả về đối tượng rỗng nếu có lỗi
        }
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); // Ngăn chặn hành động mặc định của form
    
        const totalAmount = calculateTotal();
    
        // Reset errors
        const newErrors = {};
    
        // Kiểm tra Họ và Tên
        if (!formData.name.trim()) {
            newErrors.name = "Họ và Tên không được để trống.";
        }
    
        // Kiểm tra Email
        if (!formData.email.trim()) {
            newErrors.email = "Email không được để trống.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email không đúng định dạng.";
        }
    
        // Kiểm tra Số điện thoại
        if (!formData.phone.trim()) {
            newErrors.phone = "Số điện thoại không được để trống.";
        } else if (!/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = "Số điện thoại phải có 10 chữ số.";
        }
    
        // Kiểm tra Địa chỉ
        const fullAddress = `${formData.address?.trim() || ""}, ${wardName || ""}, ${districtName || ""}, ${provinceName || ""}`.trim();
        if (!formData.address?.trim()) {
            newErrors.address = "Vui lòng nhập địa chỉ nhà.";
        } else if (!wardName || !districtName || !provinceName) {
            newErrors.address = "Vui lòng chọn đầy đủ Tỉnh/Thành, Quận/Huyện và Xã/Phường.";
        }
    
        setErrors(newErrors);
    
        // Nếu có lỗi, dừng xử lý
        if (Object.keys(newErrors).length > 0) {
            return;
        }
    
        // Tạo một object mới chứa dữ liệu để gửi lên server
        const orderData = {
            order_id: `MDH_${Date.now()}`,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: fullAddress, // Sử dụng địa chỉ đã nối
            payment_method: formData.paymentMethod, // Thêm thông tin phương thức thanh toán
            total_amount: totalAmount,
        };
    
        // Kiểm tra nếu phương thức thanh toán là MoMo
        if (orderData.payment_method === "2") {
            
            handleMomoPayment(orderData); // Gọi hàm xử lý thanh toán MoMo
        } else {
            // Tiến hành xử lý thanh toán với các phương thức khác (nếu có)
            try {
                const result = await checkout(orderData);
                Swal.fire('Thành công', 'Thanh toán thành công.', 'success');
                navigate(`/order-list`);
            } catch (error) {
                Swal.fire('Thất bại', 'Thanh toán thất bại.', 'error');
            }
        }
    };
    

    const handleMomoPayment = async (orderData) => {
        try {
            // Bước 1: Tạo đơn hàng trong cơ sở dữ liệu
            const createdOrder = await checkout(orderData);
    
           
    
            // Bước 2 và 3: Xử lý thanh toán MoMo
            const orderInfo = {
                amount: orderData.total_amount,
                orderId: orderData.order_id,
                description: "Thanh toán đơn hàng qua MoMo",
                customerInfo: {
                    name: orderData.name,
                    email: orderData.email,
                    phone: orderData.phone,
                },
            };
    
            const payUrl = await momoCheckout(orderInfo);
            if (payUrl) {
                window.location.href = payUrl;
            } else {
                Swal.fire("Lỗi", "Không nhận được URL thanh toán MoMo.", "error");
            }
        } catch (error) {
            console.error("Lỗi thanh toán MoMo:", error);
            Swal.fire("Lỗi", "Không thể tạo đơn hàng. Vui lòng thử lại.", "error");
        }
    };
    
    return (
        <div className="container py-5">
            <div className="row">
                {/* Kiểm tra trạng thái đăng nhập */}
                <>
                    {/* Hiển thị sản phẩm */}
                    <div className="col-md-6">
                        <p className="mb-4 font-semibold" style={{color: "#8c5e58", fontSize: "30px"}}>Sản phẩm của
                            bạn</p>
                        <div className="list-group">
                            {loading ? (
                                <div className="d-flex flex-column align-items-center"
                                     style={{marginTop: '10rem', marginBottom: '10rem'}}>
                                    <FontAwesomeIcon icon={faSpinner} spin
                                                     style={{fontSize: '4rem', color: '#8c5e58'}}/>
                                    <p className="mt-3" style={{color: '#8c5e58', fontSize: '18px'}}>Đang tải...</p>
                                </div>
                            ) : (
                                Array.isArray(products) && products.length > 0 ? (
                                    products.map(item => (
                                        <div key={item.id}
                                             className="list-group-item d-flex justify-content-between align-items-center">
                                            <div className="d-flex align-items-center">
                                                <img src={item.image} alt={item.name} className="img-thumbnail me-3"
                                                     style={{width: "100px", height: "100px"}}/>
                                                <div>
                                                    <p style={{
                                                        color: "#8c5e58", overflow: "hidden", // Ẩn phần không hiển thị
                                                        textOverflow: "ellipsis", // Thêm dấu ... nếu dài hơn
                                                        whiteSpace: "normal", // Cho phép xuống dòng
                                                        maxHeight: "3em",
                                                    }}>{item.name.length > 100 ? item.name.substring(0, 100) + "..." : item.name}</p>
                                                    <p className="mb-0"
                                                       style={{color: "#8c5e58"}}>{item.unit_price.toLocaleString("vi-VN", {
                                                        style: "currency",
                                                        currency: "VND",
                                                    })} x {item.quantity}</p>
                                                    <p style={{color: "#8c5e58"}}>Tổng: {total(item).toLocaleString("vi-VN", {
                                                        style: "currency",
                                                        currency: "VND",
                                                    })}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>Không có sản phẩm nào.</p>
                                )
                            )}
                        </div>

                        <p className="mt-4 font-semibold"
                           style={{color: "#8c5e58"}}>Thành tiền: {calculateTotal().toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                        })}</p>
                    </div>

                    {/* Form thông tin người dùng */}
                    <div className="col-md-6">
                        <p className="mb-4 font-semibold" style={{color: "#8c5e58", fontSize: "30px"}}>Thông tin
                            thanh toán</p>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label font-semibold" style={{color: "#8c5e58"}}>Họ và
                                    Tên</label>
                                <input
                                    type="text"
                                    className="form-control rounded"
                                    name="name"
                                    value={formData.name || ""}
                                    onChange={handleChange}
                                    required
                                    style={{color: "#8c5e58"}}
                                />
                                {errors.name && <div className="text-danger mt-2">{errors.name}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label font-semibold" style={{color: "#8c5e58"}}>Email</label>
                                <input
                                    type="email"
                                    className="form-control rounded"
                                    name="email"
                                    value={formData.email || ""}
                                    onChange={handleChange}
                                    required
                                    style={{color: "#8c5e58"}}
                                />
                                {errors.email && <div className="text-danger mt-2">{errors.email}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label font-semibold" style={{color: "#8c5e58"}}>Số điện
                                    thoại</label>
                                <input
                                    type="tel"
                                    className="form-control rounded"
                                    name="phone"
                                    value={formData.phone || ""}
                                    onChange={handleChange}
                                    required
                                    style={{color: "#8c5e58"}}
                                />
                                {errors.phone && <div className="text-danger mt-2">{errors.phone}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label font-semibold" style={{color: "#8c5e58"}}>Địa
                                    chỉ</label>
                                <div className="d-flex justify-content-between">
                                    <div className="form-group mb-2" style={{flex: 1, marginRight: "10px"}}>
                                        <select
                                            className="form-control rounded"
                                            value={selectedProvince}
                                            onChange={handleProvinceChange}
                                            required
                                            style={{backgroundColor: "white", color: "#8c5e58"}}
                                        >
                                            <option value="" className="font-bold">Chọn Tỉnh/Thành</option>
                                            {provinces.map((province) => (
                                                <option key={province.code} value={province.code}>
                                                    {province.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group mb-2" style={{flex: 1, marginRight: "10px"}}>
                                        <select
                                            className="form-control rounded"
                                            value={selectedDistrict}
                                            onChange={handleDistrictChange}
                                            required
                                            style={{backgroundColor: "white", color: "#8c5e58"}}
                                            disabled={!selectedProvince}
                                        >
                                            <option value="" className="font-bold">Chọn Quận/Huyện</option>
                                            {districts.map((district) => (
                                                <option key={district.code} value={district.code}>
                                                    {district.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group mb-2" style={{flex: 1}}>
                                        <select
                                            className="form-control rounded"
                                            value={selectedWard}
                                            onChange={handleWardChange}
                                            required
                                            style={{backgroundColor: "white", color: "#8c5e58"}}
                                            disabled={!selectedDistrict}
                                        >
                                            <option value="" className="font-bold">Chọn Xã/Phường</option>
                                            {wards.map((ward) => (
                                                <option key={ward.code} value={ward.code}>
                                                    {ward.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    className="form-control rounded"
                                    name="address"
                                    placeholder={"Vui lòng nhập địa chỉ nhà..."}
                                    onChange={handleChange}
                                    required
                                    style={{color: "#8c5e58"}}
                                />
                                {errors.address && <div className="text-danger mt-2">{errors.address}</div>}
                            </div>

                            {/* Phương thức thanh toán với icon */}
                            <div className="mb-4">
                                <label className="form-label font-semibold" style={{color: "#8c5e58"}}>Phương thức
                                    thanh toán</label>
                                <div className="d-flex">
                                    <div className="form-check me-3">
                                        <input
                                            type="radio"
                                            className="form-check-input"
                                            name="paymentMethod"
                                            value="1"
                                            checked={formData.paymentMethod === "1"}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label" style={{color: "#8c5e58"}}>
                                            <i className="fas fa-money-bill fa-2x"></i> Thanh toán khi nhận hàng
                                        </label>
                                    </div>
                                    <div className="form-check me-3">
                                        <input
                                            type="radio"
                                            className="form-check-input"
                                            name="paymentMethod"
                                            value="2"
                                            checked={formData.paymentMethod === "2"}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label" style={{color: "#8c5e58"}}>
                                            <i className="fab fa-gg-circle fa-2x"></i> Momo
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input
                                            type="radio"
                                            className="form-check-input"
                                            name="paymentMethod"
                                            value="3"
                                            checked={formData.paymentMethod === "3"}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label" style={{color: "#8c5e58"}}>
                                            <i className="fas fa-credit-card fa-2x"></i> Credit card
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Xác nhận thanh
                                toán
                            </button>
                        </form>
                    </div>
                </>
            </div>
        </div>
    );
}