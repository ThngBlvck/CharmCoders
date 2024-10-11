import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getUser, deleteUser } from "../../../../services/User";
import { getRole } from "../../../../services/Role";
import Swal from 'sweetalert2';

export default function UserList() {
    const [users, setUser] = useState([]);
    const [roles, setRoles] = useState([]); // Thêm state lưu trữ danh sách role
    const [selectedUsers, setSelectedUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
        fetchRoles(); // Gọi API lấy danh sách role
    }, []);

    const fetchUsers = async () => {
        try {
            const userList = await getUser();
            setUser(userList);
            console.log("User List:", userList);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách người dùng:", error);
            setUser([]);
        }
    };

    const fetchRoles = async () => {
        try {
            const roleList = await getRole();
            setRoles(roleList);
            console.log("Role List:", roleList);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách quyền:", error);
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
                setUser(users.filter(user => user.id !== id));
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
                setUser(users.filter(user => !selectedUsers.includes(user.id)));
                setSelectedUsers([]); // Clear danh sách đã chọn
                Swal.fire('Đã xóa!', 'Các người dùng đã được xóa.', 'success');
            } catch (error) {
                console.error("Lỗi khi xóa người dùng:", error);
                Swal.fire('Có lỗi xảy ra!', 'Không thể xóa các người dùng này.', 'error');
            }
        }
    };

    const handleEdit = (id) => {
        navigate(`/admin/product/edit/${id}`);
    };

    const handleSelectProduct = (id) => {
        if (selectedUsers.includes(id)) {
            setSelectedUsers(selectedUsers.filter(userId => userId !== id));
        } else {
            setSelectedUsers([...selectedUsers, id]);
        }
    };

    const handleSelectAll = () => {
        if (selectedUsers.length === users.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(users.map(user => user.id));
        }
    };

    const getRoleName = (roleId) => {
        const role = roles.find(r => r.id === roleId);
        return role ? role.name : 'Unknown'; // Hiển thị role name hoặc "Unknown" nếu không tìm thấy
    };

    return (
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
            <div className="rounded-t mb-0 px-4 py-3 border-0">
                <div className="flex flex-wrap items-center">
                    <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                        <h3 className="font-semibold text-lg text-blueGray-700">Người dùng</h3>
                    </div>
                    <NavLink to={`/admin/product/add`}
                             className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                             type="button">
                        Thêm Người Dùng
                    </NavLink>
                </div>
            </div>

            <div className="block w-full overflow-x-auto">
                <table className="items-center w-full bg-transparent border-collapse table-fixed">
                    <thead>
                    <tr>
                        <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">
                            <input
                                type="checkbox"
                                onChange={handleSelectAll}
                                checked={selectedUsers.length === users.length}
                            />
                        </th>
                        <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">STT</th>
                        <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">Tên</th>
                        <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">Hình ảnh</th>
                        <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">Email</th>
                        <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">Số điện thoại</th>
                        <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">Địa chỉ</th>
                        <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">Quyền Người Dùng</th>
                        <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">Thao tác</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users && users.length > 0 ? (
                        users.map((user, index) => (
                            <tr key={user.id}>
                                <td className="border-t-0 px-6 py-5 align-middle text-left flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.includes(user.id)}
                                        onChange={() => handleSelectProduct(user.id)}
                                    />
                                </td>
                                <td>
                                    <th className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4 text-left flex items-center">
                                    <span className="ml-3 text-blueGray-600">
                                        {index + 1}
                                    </span>
                                    </th>
                                </td>
                                <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4">
                                    {user.name.length > 30 ? user.name.substring(0, 30) + "..." : user.name}
                                </td>
                                <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4">
                                    <img src={user.image} alt={user.name} className="h-12 w-12 rounded"/>
                                </td>
                                <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4">{user.email}</td>
                                <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4">{user.phone}</td>
                                <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4">{user.address}</td>
                                <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4">{getRoleName(user.role_id)}</td>
                                <td className="border-t-0 px-6 align-middle text-xs whitespace-nowrap p-4">
                                    <button
                                        className="text-blue-500 hover:text-blue-700 ml-2 px-2"
                                        onClick={() => handleEdit(user.id)}
                                    >
                                        <i className="fas fa-pen text-xl"></i>
                                    </button>
                                    <button className="text-red-500 hover:text-red-700 ml-2 px-2"
                                            onClick={() => handleDelete(user.id)}>
                                        <i className="fas fa-trash text-xl"></i>
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center p-4">
                                Không có người dùng nào
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {selectedUsers.length > 0 && (
                <div className="mb-4 px-4">
                    <button
                        className="bg-red-500 text-white text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none ease-linear transition-all duration-150"
                        onClick={handleDeleteSelected}
                    >
                        Xóa các người dùng đã chọn
                    </button>
                </div>
            )}
        </div>
    );
}
