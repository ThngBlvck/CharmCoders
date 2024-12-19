import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { NavLink, useNavigate } from "react-router-dom";
import { getRole } from '../../../../services/Role';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PulseLoader } from 'react-spinners'; // Import PulseLoader từ react-spinners

export default function Role({ color }) {
    const [roles, setRoles] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true); // Thêm state loading

    useEffect(() => {
        fetchRoles();
    }, []);

    // Lấy danh sách vai trò từ API
    const fetchRoles = async () => {
        setLoading(true)
        try {
            const result = await getRole();
            setRoles(result || []);
        } catch (err) {
            console.error('Lỗi khi lấy danh sách vai trò:', err);
            setRoles([]);
            toast.error('Lỗi khi lấy danh sách vai trò. Vui lòng thử lại sau.');
        } finally {
            setLoading(false)
        }
    };

    // Hàm để hiển thị trạng thái (1 = Kích hoạt, 2 = Vô hiệu hóa)
    const renderStatus = (status) => (status == "1" ? "Hoạt động" : "Vô hiệu hóa");

    const handleEditClick = (id) => {
        navigate(`/admin/role/edit/${id}`);
    };

    return (
        <>
            <div
                className={
                    "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
                    (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")
                }
            >
                <div className="rounded-t mb-0 px-4 py-3 border-0">
                    <div className="flex flex-wrap items-center">
                        <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                            <h3
                                className="font-bold text-2xl text-blueGray-700"
                                style={{ fontFamily: "Roboto, sans-serif" }}
                            >
                                -QUẢN LÝ VAI TRÒ-
                            </h3>
                        </div>
                        {/*<NavLink*/}
                        {/*    to={`/admin/role/add`}*/}
                        {/*    className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"*/}
                        {/*    type="button"*/}
                        {/*>*/}
                        {/*    Thêm vai trò*/}
                        {/*</NavLink>*/}
                    </div>
                </div>
                { loading ? (
                    <div className="flex justify-center items-center py-4">
                        <PulseLoader color="#4A90E2" loading={loading} size={15}/>
                    </div>
                ) : (
                    <div className="block w-full overflow-x-auto">
                        <table className="items-center w-full bg-transparent border-collapse table-fixed">
                            <thead>
                            <tr>
                                <th className={"px-6 py-3 border border-solid text-center uppercase font-semibol " + (color === "light" ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100" : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")}
                                    style={{width: "10%"}}>STT
                                </th>
                                <th className={"px-6 py-3 border border-solid text-center uppercase font-semibol " + (color === "light" ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100" : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")}
                                    style={{width: "30%"}}>Tên vai trò
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {roles.length > 0 ? (
                                roles.map((role, index) => (
                                    <tr key={role.id}>
                                        <th className="border-t-0 px-6 align-middle text-xl text-center whitespace-nowrap p-4 text-left flex items-center">
                                            <span className="ml-3 font-bold text-center">{index + 1}</span>
                                        </th>
                                        <td className="border-t-0 px-6 align-middle text-xl text-center whitespace-nowrap p-4">
                                            {role.name}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center">Không có vai trò nào</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <ToastContainer/>
        </>
    );
}

Role.defaultProps = {
    color: "light",
};

Role.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
};
