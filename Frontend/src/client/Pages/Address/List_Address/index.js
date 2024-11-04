import React, { useEffect, useState } from "react";
import "../../../../assets/styles/css/bootstrap.min.css";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function List_Address() {
    const [loading, setLoading] = useState(true);
    const [addresses, setAddresses] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Giả lập việc tải dữ liệu từ server
        setTimeout(() => {
            setAddresses([
                { id: 1, name: "123 Đường ABC, Quận 1, TP. HCM" },
                { id: 2, name: "456 Đường XYZ, Quận 3, TP. HCM" },
                { id: 3, name: "789 Đường LMN, Quận 5, TP. HCM" }
            ]);
            setLoading(false);
        }, 2000); // Thời gian tải giả lập 2 giây
    }, []);

    return (
        <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <p
                    style={{fontSize: "24px", color: "#8c5e58", marginBottom: "30px"}}
                    className="text-center font-semibold flex-grow-1 m-0"
                >
                    Địa Chỉ Của Tôi
                </p>
                <NavLink to={`/add-address`}>
                    <button className="btn btn-primary font-semibold" style={{color: '#442e2b'}}>
                        Thêm địa chỉ
                    </button>
                </NavLink>
            </div>
            {loading ? (
                <div className="d-flex flex-column align-items-center"
                     style={{marginTop: '10rem', marginBottom: '10rem'}}>
                    <FontAwesomeIcon icon={faSpinner} spin style={{fontSize: '4rem', color: '#8c5e58'}}/>
                    <p className="mt-3" style={{color: '#8c5e58', fontSize: '18px'}}>Đang tải...</p>
                </div>
            ) : (
                <ul className="list-group">
                    {addresses.map((address) => (
                        <li
                            key={address.id}
                            className="list-group-item d-flex justify-content-between align-items-center"
                        >
                            {address.name}
                            <NavLink
                                to={`/edit-address/${address.id}`}
                            >
                                <button className="btn btn-primary font-semibold" style={{color: '#442e2b'}}>
                                    Chỉnh sửa
                                </button>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}