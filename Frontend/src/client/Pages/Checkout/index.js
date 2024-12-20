import React, {useEffect, useState} from "react";
import {Link, NavLink, useLocation, useNavigate, useParams} from "react-router-dom";
import {makeMomoPayment} from '../../../services/Product'; // Import service
import {getCartsByIds} from '../../../services/Cart';
import {getProductsByIds} from "../../../services/Product";
import "../../../assets/styles/css/bootstrap.min.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import {getUserInfo} from "../../../services/User";
import {checkout, momoCheckout} from '../../../services/Checkout';
import axios from "axios";
import {toast} from 'react-toastify';
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {getAddress} from "../../../services/Address";

export default function Checkout() {
    const [formData, setFormData] = useState({
        name: "", email: "", phone: "", address: "", paymentMethod: "cashOnDelivery", // Mặc định là thanh toán khi nhận hàng
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
    const [selectedAddress, setSelectedAddress] = useState("");
    const [provinceName, setProvinceName] = useState("");
    const [districtName, setDistrictName] = useState("");
    const [wardName, setWardName] = useState("");

    const [address, setAddress] = useState('');
    const [addresses, setAddresses] = useState([]);
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});
    const [user_id, setUserId] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            console.log("Payload từ token:", payload); // Xem toàn bộ payload

            // Gọi fetchUserInfo để lấy thông tin người dùng
            fetchUserInfo().then(userInfo => {
                console.log("Thông tin người dùng:", userInfo); // Xem thông tin người dùng đã nhận
                setUserId(userInfo.user_id);
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
        fetchAddresses();
    }, [location.search]);

    const fetchAddresses = async () => {
        setLoading(true); // Bắt đầu tải dữ liệu
        try {
            const result = await getAddress();
            setAddresses(result || []); // Nếu result là null thì dùng mảng rỗng
            console.log("Addresses List:", addresses);
        } catch (err) {
            console.error('Error fetching addresses:', err);
            setAddresses([]); // Đảm bảo addresses không bị undefined
        } finally {
            setLoading(false); // Kết thúc tải dữ liệu
        }
    };

    const fullAddressUser = ({address, ward, district, province}) => {
        // Tạo mảng chứa các thành phần không bị undefined, null hoặc chuỗi rỗng
        const parts = [address?.trim(), ward?.trim(), district?.trim(), province?.trim()].filter(Boolean);

        // Ghép các thành phần với dấu phẩy và khoảng trắng
        return parts.join(", ");
    };

    const handleAddressChange = (e) => {
        const selectedId = e.target.value;  // Lấy giá trị id từ select
        console.log("Selected ID:", selectedId);  // Log giá trị id đã chọn

        const address = addresses.find((address) => address.id === Number(selectedId));  // Tìm address tương ứng
        console.log("Found Address:", address);  // Log đối tượng address

        if (address) {
            setSelectedAddress(address);  // Cập nhật selectedAddress nếu tìm thấy
        } else {
            console.log("Không tìm thấy địa chỉ với ID:", selectedId);
        }
    };

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
                                ...product, quantity: cart.quantity
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

    const total = (item) => {
        // Sử dụng sale_price nếu tồn tại, nếu không thì lấy unit_price
        const price = item.sale_price || item.unit_price;
        return price * item.quantity;
    };

    const calculateTotal = () => {
        if (!Array.isArray(products) || products.length === 0) {
            return 0; // Trả về 0 nếu không phải là mảng hoặc mảng rỗng
        }
        return products.reduce((total, item) => {
            // Sử dụng sale_price nếu tồn tại, nếu không thì lấy unit_price
            const price = item.sale_price || item.unit_price;
            return total + (price * item.quantity);
        }, 0);
    };

    // Hàm tính tổng tiền tiết kiệm
    const calculateSavings = () => {
        if (!Array.isArray(products) || products.length === 0) {
            return 0; // Trả về 0 nếu không phải là mảng hoặc mảng rỗng
        }
        return products.reduce((savings, item) => {
            // Kiểm tra nếu có sale_price thì tính phần tiết kiệm
            if (item.sale_price) {
                return savings + ((item.unit_price - item.sale_price) * item.quantity);
            }
            return savings;
        }, 0);
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
            ...formData, [name]: value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); // Ngăn chặn hành động mặc định của form

        const totalAmount = calculateTotal();

        // Reset errors
        const newErrors = {};

        // Kiểm tra các trường đầu vào
        if (!formData.name.trim()) {
            newErrors.name = "Họ và Tên không được để trống.";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email không được để trống.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email không đúng định dạng.";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Số điện thoại không được để trống.";
        } else if (!/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = "Số điện thoại phải có 10 chữ số.";
        }

        // Kiểm tra địa chỉ chỉ khi người dùng chưa chọn địa chỉ từ danh sách
        if (!selectedAddress) {
            if (!formData.address?.trim()) {
                newErrors.address = "Vui lòng nhập địa chỉ nhà.";
            } else if (!wardName || !districtName || !provinceName) {
                newErrors.address = "Vui lòng chọn đầy đủ Tỉnh/Thành, Quận/Huyện và Xã/Phường.";
            }
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        // Lấy cartIds từ URL params
        const cartIds = new URLSearchParams(window.location.search).get("cartIds");
        const cartIdsArray = cartIds ? cartIds.split(",") : [];  // Giả sử cartIds là một chuỗi phân tách bởi dấu phẩy

        const getFullAddressFromForm = () => {
            if (provinceName?.trim() && districtName?.trim() && wardName?.trim() && formData.address?.trim()) {
                return `${formData.address.trim()}, ${wardName.trim()}, ${districtName.trim()}, ${provinceName.trim()}`;
            }
            return ""; // Nếu chưa đủ dữ liệu, trả về chuỗi trống
        };

        const orderData = {
            order_id: `MDH_${Date.now()}`,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: selectedAddress ? fullAddressUser(selectedAddress) : getFullAddressFromForm(),
            payment_method: formData.paymentMethod,
            total_amount: totalAmount,
            cart_ids: cartIdsArray,  // Thêm cartIds từ URL vào orderData
        };


        // Kiểm tra phương thức thanh toán
        if (orderData.payment_method === "2") {
            handleMomoPayment(orderData);  // Xử lý thanh toán MoMo
        } else {
            try {
                const result = await checkout(orderData);  // Gửi request với orderData có cart_ids
                toast.success("Thanh toán thành công.");
                navigate(`/payment-result?resultCode=0`);
            } catch (error) {
                console.error("Thanh toán thất bại: ", error);
                toast.error("Thanh toán thất bại.");
            }
        }
    };

    const handleMomoPayment = async (orderData) => {
        const fee = orderData.total_amount >= 500000 ? 50000 : 30000;
        const extradata = products.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            user_id: user_id,
            address: orderData.address,
            price: item.sale_price ? item.sale_price : item.unit_price,
        }));
        try {
            const orderInfo = {
                amount: orderData.total_amount + fee,
                orderId: orderData.order_id,
                description: "Thanh toán đơn hàng qua MoMo",
                extraData: JSON.stringify(extradata),
                customerInfo: {
                    name: orderData.name, email: orderData.email, phone: orderData.phone,
                },
            };

            const payUrl = await momoCheckout(orderInfo);
            console.log(orderInfo);
            if (payUrl) {
                window.location.href = payUrl;
            } else {
                toast.error("Không nhận được đường dẫn thanh toán MoMo.");
            }
        } catch (error) {
            console.error("Lỗi thanh toán MoMo:", error);
            toast.error("Không thể tạo đơn hàng. Vui lòng thử lại.");
        }
    };

    return (<div className="container py-5">
        <div className="row">
            {/* Kiểm tra trạng thái đăng nhập */}
            <>
                {/* Hiển thị sản phẩm */}
                <div className="col-md-6">
                    <p className="mb-4 font-semibold text-dGreen fs-30">Sản phẩm của
                        bạn</p>
                    <div className="list-group">
                        {loading ? (Array.from({length: 3}).map((_, index) => (<div
                            key={index}
                            className="list-group-item d-flex justify-content-between align-items-center"
                        >
                            {/* Skeleton cho hình ảnh sản phẩm */}
                            <div className="d-flex align-items-center">
                                <Skeleton
                                    className="me-3"
                                    width={80}
                                    height={80}
                                    style={{borderRadius: "5px"}}
                                />
                                {/* Skeleton cho thông tin sản phẩm */}
                                <div>
                                    <Skeleton width="70%" height={20} className="mb-2"/>
                                    <Skeleton width="50%" height={15}/>
                                </div>
                            </div>
                        </div>))) : (Array.isArray(products) && products.length > 0 ? (products.map(item => (
                            <div key={item.id}
                                 className="list-group-item d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <img src={item.image} alt={item.name}
                                         className="img-thumbnail me-3 img-checkout"/>
                                    <div>
                                        <p className="text-dGreen name-checkout">
                                            {item.name.length > 100 ? item.name.substring(0, 100) + "..." : item.name}
                                        </p>
                                        <p className="mb-0 text-dGreen">
                                            {item.sale_price ? (<>
                                                            <span
                                                                className="text-decoration-line-through text-dGreen fs-14">
                                                                {item.unit_price.toLocaleString("vi-VN", {
                                                                    style: "currency", currency: "VND"
                                                                })}
                                                            </span>
                                                {" "}
                                                <span className="font-bold salePr fs-16">
                                                                {item.sale_price.toLocaleString("vi-VN", {
                                                                    style: "currency", currency: "VND"
                                                                })}
                                                            </span>
                                            </>) : (<span className="text-dGreen fs-16">
                                                                {item.unit_price.toLocaleString("vi-VN", {
                                                                    style: "currency", currency: "VND"
                                                                })}
                                                            </span>)}
                                            {" x "}{item.quantity}
                                        </p>
                                    </div>
                                </div>
                            </div>))) : (<p className="text-dGreen font-semibold fs-20">Không có sản phẩm nào.</p>))}
                    </div>

                    <p className="mt-4 font-semibold text-dGreen">Tổng cộng: {calculateTotal().toLocaleString("vi-VN", {
                            style: "currency", currency: "VND",
                        })}</p>
                    <span className="text-dGreen">(Tiết kiệm: {calculateSavings().toLocaleString("vi-VN", {
                        style: "currency", currency: "VND"
                    })})</span>
                    <p className="mt-2 font-semibold text-dGreen">
                        Phí ship: {(
                        calculateTotal() >= 500000 ? 50000 : 30000
                    ).toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                    })}
                    </p>
                    <p className="mt-2 font-semibold text-dGreen">
                        Thành tiền: {(
                        calculateTotal() + (calculateTotal() >= 500000 ? 50000 : 30000)
                    ).toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                    })}
                    </p>
                </div>

                {/* Form thông tin người dùng */}
                <div className="col-md-6">
                    <p className="mb-4 font-semibold text-dGreen fs-30">Thông tin
                        thanh toán</p>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label font-semibold text-dGreen">Họ và
                                Tên</label>
                            <input
                                type="text"
                                className="form-control rounded text-dGreen"
                                name="name"
                                value={formData.name || ""}
                                onChange={handleChange}
                                required
                            />
                            {errors.name && <div className="text-danger mt-2">{errors.name}</div>}
                        </div>
                        <div className="mb-3">
                            <label className="form-label font-semibold text-dGreen">Email</label>
                            <input
                                type="email"
                                className="form-control rounded text-dGreen"
                                name="email"
                                value={formData.email || ""}
                                onChange={handleChange}
                                required
                            />
                            {errors.email && <div className="text-danger mt-2">{errors.email}</div>}
                        </div>
                        <div className="mb-1 d-flex justify-between">
                            <div>
                                <label className="form-label font-semibold text-dGreen">Số điện thoại:</label>
                                <label className="text-dGreen ml-2">{formData.phone ? formData.phone : "Chưa thêm số điện thoại"}</label>
                            </div>
                            <NavLink to={`/edit_phone`}>
                                <div className="text-dGreen">
                                    <i className="fa-solid fa-square-plus"></i> {formData.phone ? "Sửa số điện thoại" : "Thêm số điện thoại"}
                                </div>
                            </NavLink>
                        </div>
                        <div className="mb-3">
                            <div className="d-flex justify-between">
                            <div>
                                    <label className="form-label font-semibold text-dGreen">Địa chỉ</label>
                                </div>
                                <NavLink to={`/add-address`}>
                                    <div className="text-dGreen">
                                        <i className="fa-solid fa-square-plus"></i> Thêm địa chỉ
                                    </div>
                                </NavLink>
                            </div>
                            {addresses.length > 0 ? (<div className="form-group mb-2 flex-1 mr-1">
                                <select
                                    className="form-control rounded bg-white text-dGreen"
                                    value={selectedAddress ? selectedAddress.id : ""}
                                    onChange={handleAddressChange}
                                    required
                                >
                                    <option value="" className="font-bold">Chọn Địa chỉ</option>
                                    {addresses.map((address) => (<option key={address.id} value={address.id}>
                                        {fullAddressUser(address)}
                                    </option>))}
                                </select>
                                {errors.address && <div className="text-danger mt-2">{errors.address}</div>}
                            </div>) : (<div>
                                <div className="d-flex justify-content-between">
                                    <div className="form-group mb-2 flex-1 mr-1">
                                        <select
                                            className="form-control rounded bg-white text-dGreen"
                                            value={selectedProvince}
                                            onChange={handleProvinceChange}
                                            required
                                        >
                                            <option value="" className="font-bold">Chọn Tỉnh/Thành</option>
                                            {provinces.map((province) => (
                                                <option key={province.code} value={province.code}>
                                                    {province.name}
                                                </option>))}
                                        </select>
                                    </div>

                                    <div className="form-group mb-2 flex-1 mr-1">
                                        <select
                                            className="form-control rounded bg-white text-dGreen"
                                            value={selectedDistrict}
                                            onChange={handleDistrictChange}
                                            required
                                            disabled={!selectedProvince}
                                        >
                                            <option value="" className="font-bold">Chọn Quận/Huyện</option>
                                            {districts.map((district) => (
                                                <option key={district.code} value={district.code}>
                                                    {district.name}
                                                </option>))}
                                        </select>
                                    </div>

                                    <div className="form-group mb-2" style={{flex: 1}}>
                                        <select
                                            className="form-control rounded bg-white text-dGreen"
                                            value={selectedWard}
                                            onChange={handleWardChange}
                                            required
                                            disabled={!selectedDistrict}
                                        >
                                            <option value="" className="font-bold">Chọn Xã/Phường</option>
                                            {wards.map((ward) => (<option key={ward.code} value={ward.code}>
                                                {ward.name}
                                            </option>))}
                                        </select>
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    className="form-control rounded text-dGreen"
                                    name="address"
                                    placeholder={"Vui lòng nhập địa chỉ nhà..."}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.address && <div className="text-danger mt-2">{errors.address}</div>}
                            </div>)}
                        </div>
                        {/* Phương thức thanh toán với icon */}
                        <div className="mb-4">
                            <label className="form-label font-semibold text-dGreen">Phương thức
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
                                    <label className="form-check-label text-dGreen">
                                        Thanh toán khi nhận hàng
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
                                    <label className="form-check-label text-dGreen">
                                        Thanh toán qua MoMo
                                    </label>
                                </div>
                            </div>

                        </div>

                        <div className="d-flex justify-center">
                            <button type="submit" className="butn w-40 rounded shadow" onClick={handleSubmit}>Xác
                                nhận thanh
                                toán
                            </button>
                        </div>
                    </form>
                </div>
            </>
        </div>
    </div>);
}