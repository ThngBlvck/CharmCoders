import React, { useEffect, useState } from "react";
import "../../../../assets/styles/css/bootstrap.min.css";
import { NavLink, useNavigate } from "react-router-dom";
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getAddress, deleteAddress } from "../../../../services/Address";
import Swal from "sweetalert2";
import {toast} from "react-toastify";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function List_Address() {
    const [loading, setLoading] = useState(true);
    const [addresses, setAddresses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAddresses(); // Gọi hàm fetchAddresses khi component được render lần đầu
    }, []);

    const fetchAddresses = async () => {
        setLoading(true); // Bắt đầu tải dữ liệu
        try {
            const result = await getAddress();
            setAddresses(result || []); // Nếu result là null thì dùng mảng rỗng
        } catch (err) {
            console.error('Error fetching addresses:', err);
            setAddresses([]); // Đảm bảo addresses không bị undefined
        } finally {
            setLoading(false); // Kết thúc tải dữ liệu
        }
    };

    // Hàm xử lý xóa
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Thông báo',
            text: "Bạn có chắc chắn muốn xóa địa chỉ?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Có!',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            try {
                // Gọi hàm xóa địa chỉ bằng id
                await deleteAddress(id);

                // Cập nhật lại danh sách địa chỉ sau khi xóa
                setAddresses(prevAddresses => prevAddresses.filter(address => address.id !== id));
                toast.success("Xóa địa chỉ thành công.");
            } catch (error) {
                console.error("Lỗi khi xóa địa chỉ:", error);
                toast.error("Không thể xóa địa chỉ.");
            }
        }
    };

    const fullAddress = ({ address, ward, district, province }) => {
        // Tạo mảng chứa các thành phần không bị undefined, null hoặc chuỗi rỗng
        const parts = [address?.trim(), ward?.trim(), district?.trim(), province?.trim()].filter(Boolean);

        // Ghép các thành phần với dấu phẩy và khoảng trắng
        return parts.join(", ");
    };

    return (
        <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <p
                    className="text-center font-semibold flex-grow-1 m-0 text-dGreen fs-24 mb-3"
                >
                    Địa Chỉ Của Tôi
                </p>
                <NavLink to={`/add-address`}>
                    <button className="butn w-100 py-3 px-3 rounded font-semibold shadow">
                        Thêm địa chỉ
                    </button>
                </NavLink>
            </div>
            {loading ? (
                <ul className="list-group">
                    {Array.from({length: 5}).map((_, index) => (
                        <li
                            key={index}
                            className="list-group-item d-flex justify-content-between align-items-center text-dGreen"
                        >
                            <Skeleton width="60%" height="20px"/>
                            <div className="d-flex justify-content-evenly">
                                <Skeleton circle={true} width={40} height={40}/>
                                <Skeleton
                                    circle={true}
                                    width={40}
                                    height={40}
                                    style={{marginLeft: "10px"}}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <ul className="list-group">
                    {addresses.length > 0 ? (
                        addresses.map((address) => (
                        <li
                            key={address.id}
                            className="list-group-item d-flex justify-content-between align-items-center text-dGreen"
                        >
                            {fullAddress(address)}
                            <div className="d-flex justify-content-evenly">
                                <NavLink to={`/edit-address/${address.id}`}>
                                    <button className="btn-tk btn-address rounded font-semibold shadow">
                                        <i className="fa-solid fa-pen"></i>
                                    </button>
                                </NavLink>
                                <button className="btn-huy btn-address rounded font-semibold shadow"
                                        style={{marginLeft: '10px'}} onClick={() => handleDelete(address.id)}>
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </li>
                        ))
                    ) : (
                        <p className="text-dGreen fs-20 text-center mt-2 mb-3">Chưa có địa chỉ. Vui lòng thêm địa chỉ của bạn.</p>
                    )}
                </ul>
            )}
        </div>
    );
}