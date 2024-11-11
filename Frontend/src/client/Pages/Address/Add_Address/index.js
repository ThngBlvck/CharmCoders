import React, {useEffect, useState} from "react";
import "../../../../assets/styles/css/style.css";
import "../../../../assets/styles/css/bootstrap.min.css";
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import axios from "axios";
import {postAddress} from "../../../../services/Address";
import Swal from "sweetalert2";

export default function Add_Address() {
    const location = useLocation();
    const [loading, setLoading] = useState(false); // Thêm state loading

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

    const handleSubmit = async (event) => {
        event.preventDefault(); // Ngăn chặn hành động mặc định của form

        // Reset errors
        const newErrors = {};

        // Kiểm tra Địa chỉ
        const fullAddress = `${address?.trim() || ""}, ${wardName || ""}, ${districtName || ""}, ${provinceName || ""}`.trim();
        if (!address?.trim()) {
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
        const addressData = {
            address: fullAddress, // Sử dụng địa chỉ đã nối
        };
        console.log(addressData)

        // Kiểm tra xem địa chỉ có phải là chuỗi không
        if (typeof addressData.address !== "string" || addressData.address.length === 0) {
            setMessage("Địa chỉ phải là chuỗi ký tự.");
            return; // Dừng lại nếu địa chỉ không hợp lệ
        }

        // Gọi hàm checkout với dữ liệu đã chuẩn bị
        try {
            const result = await postAddress(addressData);
            Swal.fire('Thành công', 'Thêm địa chỉ thành công.', 'success');
            navigate(`/address`);
        } catch (error) {
            Swal.fire('Thất bại', 'Thêm địa chỉ thất bại.', 'error');
        }
    };

    return (
        <>
            <div className="container py-5">
                <div className="row g-4 justify-center">
                    <div className="col-8">
                        <div className="p-4 bg-light border rounded">
                            <p className="font-semibold mb-4 text-center"
                               style={{color: "#8c5e58", fontSize: "30px"}}>Thêm Địa Chỉ</p>
                            <form>
                                <label style={{color: "#8c5e58", fontSize: "20px"}}
                                       className="font-semibold mb-2">Địa Chỉ:</label>
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
                                <div className="form-group mb-4">
                                    <input
                                        type="text"
                                        className="form-control rounded"
                                        name="address"
                                        placeholder={"Vui lòng nhập địa chỉ nhà..."}
                                        value={address} // Bind state to input
                                        onChange={(e) => setAddress(e.target.value)} // Update state
                                    />
                                    {errors.address && <div className="text-danger mt-2">{errors.address}</div>}
                                </div>
                                <button className="btn btn-primary w-100 mt-3 font-semibold" type="submit"
                                        style={{color: '#442e2b', fontSize: "20px"}}
                                        onClick={handleSubmit}>
                                    Thêm
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
