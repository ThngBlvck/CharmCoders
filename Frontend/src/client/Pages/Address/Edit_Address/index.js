import React, {useEffect, useState} from "react";
import "../../../../assets/styles/css/style.css";
import "../../../../assets/styles/css/bootstrap.min.css";
import {NavLink, useLocation, useNavigate, useParams} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import axios from "axios";
import {postAddress, updateAddress} from "../../../../services/Address";
import { toast } from 'react-toastify';

export default function Edit_Address() {
    const location = useLocation();
    const [loading, setLoading] = useState(false); // Thêm state loading

    const {id} = useParams(); // Lấy id từ URL

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
        if (id) {
            // Gọi API để lấy địa chỉ hiện tại
            axios.get(`https://your-api-url.com/addresses/${id}`)
                .then(response => {
                    const addressData = response.data;
                    setAddress(addressData.address); // Điền vào ô địa chỉ
                    const fullAddress = addressData.address.split(','); // Tách địa chỉ thành các phần (Tỉnh/Quận/Xã)

                    // Giả sử định dạng địa chỉ là: "Địa chỉ, Xã/Phường, Quận/Huyện, Tỉnh/Thành"
                    if (fullAddress.length >= 3) {
                        setWardName(fullAddress[0].trim());
                        setDistrictName(fullAddress[1].trim());
                        setProvinceName(fullAddress[2].trim());
                    }

                    // Lấy mã Tỉnh/Quận/Xã từ tên đã phân tích
                    const province = provinces.find(p => p.name === provinceName);
                    if (province) setSelectedProvince(province.code);

                    const district = districts.find(d => d.name === districtName);
                    if (district) setSelectedDistrict(district.code);

                    const ward = wards.find(w => w.name === wardName);
                    if (ward) setSelectedWard(ward.code);
                })
                .catch(error => {
                    console.error("Error fetching address:", error);
                });
        }
    }, [id, provinces, districts, wards, provinceName, districtName, wardName]);

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

        // Tìm tên tỉnh dựa trên code
        const selectedProvinceObj = provinces.find(province => province.code === selectedProvince);
        if (selectedProvinceObj) {
            setProvinceName(selectedProvinceObj.name); // Cập nhật tên tỉnh
        }
    };

    const handleDistrictChange = (e) => {
        const selectedDistrict = e.target.value;
        setSelectedDistrict(selectedDistrict);

        // Tìm tên huyện dựa trên code
        const selectedDistrictObj = districts.find(district => district.code === selectedDistrict);
        if (selectedDistrictObj) {
            setDistrictName(selectedDistrictObj.name); // Cập nhật tên huyện
        }
    };

    const handleWardChange = (event) => {
        const selectedWard = event.target.value;
        setSelectedWard(selectedWard);

        // Tìm tên xã/phường dựa trên code
        const selectedWardObj = wards.find(ward => ward.code === selectedWard);
        if (selectedWardObj) {
            setWardName(selectedWardObj.name); // Cập nhật tên xã/phường
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

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

        // Nếu có lỗi thì không gửi
        if (Object.keys(newErrors).length > 0) {
            return;
        }

        const addressData = {
            address: fullAddress, // Cập nhật địa chỉ đầy đủ
        };

        try {
            const result = await updateAddress(id, addressData); // Gọi API update
            toast.success("Cập nhật địa chỉ thành công.");
            navigate(`/address`);
        } catch (error) {
            toast.error("Cập nhật địa chỉ thất bại.");
        }
    };

    const handleCancel = () => {
        navigate("/address"); // Chuyển hướng về trang /address
    };

    return (
        <>
            <div className="container py-5">
                <div className="row g-4 justify-center">
                    <div className="col-8">
                        <div className="p-4 bg-light border rounded shadow">
                            <p className="font-semibold mb-2 text-center text-dGreen fs-30">Sửa Địa Chỉ</p>
                            <form>
                                <label className="font-semibold mb-2 text-dGreen fs-20">Địa Chỉ:</label>
                                <div className="d-flex justify-content-between">
                                    <div className="form-group mb-2" style={{flex: 1, marginRight: "10px"}}>
                                        <select
                                            className="form-control rounded text-dGreen bg-white"
                                            value={selectedProvince}
                                            onChange={handleProvinceChange}
                                            required
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
                                            className="form-control rounded text-dGreen bg-white"
                                            value={selectedDistrict}
                                            onChange={handleDistrictChange}
                                            required
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
                                            className="form-control rounded text-dGreen bg-white"
                                            value={selectedWard}
                                            onChange={handleWardChange}
                                            required
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
                                        value={address} // Lấy giá trị từ state
                                        onChange={(e) => setAddress(e.target.value)} // Cập nhật khi người dùng nhập
                                        placeholder={"Vui lòng nhập địa chỉ nhà..."}
                                    />
                                    {errors.address && <div className="text-danger mt-2">{errors.address}</div>}
                                </div>
                                <div className="d-flex justify-content-center">
                                    <button className="butn rounded shadow mx-2 font-semibold fs-20 w-25" type="submit"
                                            onClick={handleSubmit}>
                                        Sửa
                                    </button>
                                    <button className="butn rounded shadow mx-2 font-semibold fs-20 w-25" type="button"
                                            onClick={handleCancel}>
                                        Hủy
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
