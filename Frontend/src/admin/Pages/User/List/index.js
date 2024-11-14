import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getUser, deleteUser } from "../../../../services/User";
import { getRole } from "../../../../services/Role";
import Swal from 'sweetalert2';
import {PulseLoader} from "react-spinners"; // Hàm lấy danh sách danh mục

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 3; // Số sản phẩm trên mỗi trang

    const userToken = localStorage.getItem("token");
    let userRole = null;

    if (userToken) {
        const parts = userToken.split('.');
        if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            console.log("Token payload:", payload); // In ra payload để kiểm tra
            userRole = payload.scopes.includes("admin") ? "admin" : (payload.scopes.includes("employee") ? "employee" : "user");
            console.log("User Role:", userRole);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([fetchUsers(), fetchRoles()]);
        };

        fetchData();
    }, []);

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const userList = await getUser();
            setUsers(userList);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách người dùng:", error);
            setUsers([]);
        } finally {
            setLoading(false)
        }
    };

    const fetchRoles = async () => {
        setLoading(true)
        try {
            const roleList = await getRole();
            setRoles(roleList);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách quyền:", error);
        } finally {
            setLoading(false)
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: "Bạn sẽ không thể khôi phục người dùng này!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Có!',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            try {
                await deleteUser(id);
                setUsers(users.filter(user => user.id !== id));
                Swal.fire('Đã xóa!', 'Người dùng đã được xóa.', 'success');
            } catch (error) {
                console.error("Lỗi khi xóa người dùng:", error);
                Swal.fire('Có lỗi xảy ra!', 'Không thể xóa người dùng này.', 'error');
            }
        }
    };

    const handleDeleteSelected = async () => {
        const result = await Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: "Bạn sẽ không thể khôi phục các người dùng này!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Có!',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            try {
                await Promise.all(selectedUsers.map(id => deleteUser(id)));
                setUsers(users.filter(user => !selectedUsers.includes(user.id)));
                setSelectedUsers([]);
                Swal.fire('Đã xóa!', 'Các người dùng đã được xóa.', 'success');
            } catch (error) {
                console.error("Lỗi khi xóa người dùng:", error);
                Swal.fire('Có lỗi xảy ra!', 'Không thể xóa các người dùng này.', 'error');
            }
        }
    };

    const handleEdit = (id) => {
        navigate(`/admin/user/edit/${id}`);
    };

    const handleSelectUser = (id) => {
        setSelectedUsers(prevSelected =>
            prevSelected.includes(id)
                ? prevSelected.filter(userId => userId !== id)
                : [...prevSelected, id]
        );
    };

    const handleSelectAll = () => {
        setSelectedUsers(selectedUsers.length === users.length ? [] : users.map(user => user.id));
    };

    const getRoleName = (roleId) => {
        const role = roles.find(r => r.id === roleId);
        return role ? role.name : 'Unknown';
    };

    const handlePageChange = (page) => {
        if (page > 0 && page <= Math.ceil(users.length / usersPerPage)) {
            setCurrentPage(page);
        }
    };


    return (
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
            <div className="rounded-t mb-0 px-4 py-3 border-0">
                <div className="flex flex-wrap items-center">
                    <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                        <h3 className="font-semibold text-lg text-blueGray-700">Người dùng</h3>
                    </div>
                    {userRole === "admin" && (
                        <NavLink to={`/admin/user/add`}
                                 className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
                            Thêm Nhân Viên
                        </NavLink>
                    )}
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
                            {userRole !== "admin" ? (
                                <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left"></th>
                            ) : (
                                <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">
                                    <input
                                        type="checkbox"
                                        onChange={handleSelectAll}
                                        checked={selectedUsers.length === users.length}
                                    />
                                </th>
                            )}
                            <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">STT</th>
                            <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">Tên</th>
                            <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">Hình
                                ảnh
                            </th>
                            <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">Email</th>
                            <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">Số
                                điện thoại
                            </th>
                            <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">Địa
                                chỉ
                            </th>
                            <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">Quyền
                                Người Dùng
                            </th>
                            {userRole !== "admin" ? (
                                <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left"></th>
                            ) : (
                                <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">Thao
                                    tác</th>
                            )
                            }
                        </tr>
                        </thead>
                        <tbody>
                        {users.length > 0 ? (
                            users.map((user, index) => (
                                <tr key={user.id}>
                                    <td className="border-t-0 px-6 py-5 align-middle text-left flex items-center">
                                        {/* Hiển thị checkbox cho nhân viên (role_id == 2) và người dùng khác không phải là admin (role_id khác 1) */}
                                        {user.role_id === 3 && userRole === "admin" ? (
                                            <input
                                                type="checkbox"
                                                checked={selectedUsers.includes(user.id)}
                                                onChange={() => handleSelectUser(user.id)}
                                            />
                                        ) : (
                                            <span className="w-4 h-4"/>
                                        )}
                                    </td>
                                    <td>
                                        <th className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4 text-left flex items-center">
                                            <span className="ml-3 text-blueGray-600">{index + 1}</span>
                                        </th>
                                    </td>
                                    <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4 text-left">{user.name}</td>
                                    <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4 text-left">
                                        {user.avatar ? (
                                            <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full"/>
                                        ) : (
                                            <i className="fas fa-user-circle text-3xl text-gray-400"/>
                                        )}
                                    </td>
                                    <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4 text-left">{user.email}</td>
                                    <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4 text-left">{user.phone}</td>
                                    <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4 text-left">{user.address}</td>
                                    <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4 text-left">{getRoleName(user.role_id)}</td>
                                    <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4 text-left">
                                        {userRole === "admin" && user.role_id == 3 && (
                                            <>
                                                <button
                                                    onClick={() => handleEdit(user.id)}
                                                    className="text-blue-500 hover:text-blue-700 ml-2 px-2"
                                                >
                                                    <i className="fas fa-pen text-xl"></i>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="text-red-500 hover:text-red-700 ml-2 px-2"
                                                >
                                                    <i className="fas fa-trash text-xl"></i>
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={9} className="text-center p-4">Không có người dùng nào.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Phân trang */}
            <div className="flex justify-center items-center mt-4">
                {/* Nút Previous */}
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 mx-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    &#9664; {/* Mũi tên trái */}
                </button>

                {/* Trang hiện tại */}
                <span className="px-4 py-2 mx-1 bg-gray-100 text-gray-800 border rounded">
                    Trang {currentPage} / {Math.ceil(users.length / usersPerPage) || 1}
                </span>

                {/* Nút Next */}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === Math.ceil(users.length / usersPerPage)}
                    className="px-4 py-2 mx-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    &#9654; {/* Mũi tên phải */}
                </button>
            </div>

            {userRole === "admin" && selectedUsers.length > 0 && (
                <div className="flex justify-end p-4">
                    <button
                        onClick={handleDeleteSelected}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                        Xóa đã chọn
                    </button>
                </div>
            )}
        </div>
    );
}
