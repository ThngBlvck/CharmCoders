import React, { useEffect, useState } from "react";
import "../../../../assets/styles/css/bootstrap.min.css";
import { NavLink, useNavigate } from "react-router-dom";
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getAddress, deleteAddress } from "../../../../services/Address";
import Swal from "sweetalert2";
import {toast} from "react-toastify";

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
            Swal.fire('Lỗi', 'Lỗi khi tải danh sách địa chỉ. Vui lòng thử lại.', 'error');
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

                Swal.fire('Thành công', 'Xóa địa chỉ thành công.', 'success');
            } catch (error) {
                console.error("Lỗi khi xóa địa chỉ:", error);
                toast.error("Không thể xóa địa chỉ.");
            }
        }
    };

    return (
        <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <p
                    style={{ fontSize: "24px", color: "#8c5e58", marginBottom: "30px" }}
                    className="text-center font-semibold flex-grow-1 m-0"
                >
                    Địa Chỉ Của Tôi
                </p>
                <NavLink to={`/add-address`}>
                    <button className="btn btn-primary font-semibold" style={{ color: '#442e2b' }}>
                        Thêm địa chỉ
                    </button>
                </NavLink>
            </div>
            {loading ? (
                <div className="d-flex flex-column align-items-center" style={{ marginTop: '10rem', marginBottom: '10rem' }}>
                    <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: '4rem', color: '#8c5e58' }} />
                    <p className="mt-3" style={{ color: '#8c5e58', fontSize: '18px' }}>Đang tải...</p>
                </div>
            ) : (
                <ul className="list-group">
                    {addresses.map((address) => (
                        <li
                            key={address.id}
                            className="list-group-item d-flex justify-content-between align-items-center"
                        >
                            {address.address}
                            <div>
                                <NavLink to={`/edit-address/${address.id}`}>
                                    <button className="btn btn-primary font-semibold" style={{color: '#442e2b'}}>
                                        <i className="fa-solid fa-pen"></i>
                                    </button>
                                </NavLink>
                                <button className="btn btn-primary font-semibold" style={{color: '#442e2b', marginLeft: '10px'}} onClick={() => handleDelete(address.id)}>
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}