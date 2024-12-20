import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getUser, deleteUser, searchUser } from "../../../../services/User";
import { getRole } from "../../../../services/Role";
import Swal from 'sweetalert2';
import {PulseLoader} from "react-spinners";
import {faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"; // Hàm lấy danh sách danh mục

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 4; // Số sản phẩm trên mỗi trang
    const [displayedUsers, setDisplayedUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // State lưu trữ từ khóa tìm kiếm
    const userToken = localStorage.getItem("token");
    let userRole = null;

    if (userToken) {
        const parts = userToken.split('.');
        if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            console.log("Token payload:", payload); // In ra payload để kiểm tra
            userRole = payload.scopes.includes("admin") ? "admin" : (payload.scopes.includes("employee") ? "employee" : "user");
        }
    }
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await Promise.all([fetchUsers(), fetchRoles()]);
        };
        fetchData();
    }, [searchTerm, currentPage]); // Khi `searchTerm` hoặc `currentPage` thay đổi, gọi lại `fetchData`

    const fetchUsers = async () => {
        try {
            setLoading(true);
            let result;
            if (searchTerm.trim() === "") {
                result = await getUser(); // Lấy danh sách người dùng nếu không tìm kiếm
            } else {
                const sanitizedSearchTerm = removeVietnameseTones(searchTerm);
                result = await searchUser(sanitizedSearchTerm); // Lấy kết quả tìm kiếm
            }

            if (Array.isArray(result)) {
                setUsers(result); // Cập nhật danh sách người dùng
            } else if (result && result.users && Array.isArray(result.users)) {
                setUsers(result.users); // Cập nhật danh sách tìm kiếm
            } else {
                setUsers([]); // Nếu không có kết quả tìm kiếm
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách người dùng:", error);
            setUsers([]); // Nếu có lỗi
        } finally {
            setLoading(false);
        }
    };

// Cập nhật phân trang
    useEffect(() => {
        const startIndex = (currentPage - 1) * usersPerPage;
        const endIndex = startIndex + usersPerPage;
        setDisplayedUsers(users.slice(startIndex, endIndex)); // Hiển thị người dùng theo trang
    }, [currentPage, users]); // Khi `currentPage` hoặc `users` thay đổi


    const removeVietnameseTones = (str) => {
        const accents = {
            a: 'áàảãạâấầẩẫậăắằẳẵặ',
            e: 'éèẻẽẹêếềểễệ',
            i: 'íìỉĩị',
            o: 'óòỏõọôốồổỗộơớờởỡợ',
            u: 'úùủũụưứừửữự',
            y: 'ýỳỷỹỵ',
            d: 'đ'
        };

        for (let nonAccent in accents) {
            const accent = accents[nonAccent];
            str = str.replace(new RegExp(`[${accent}]`, 'g'), nonAccent);
        }
        return str;
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

    // Phân trang
    const handlePageChange = (page) => {
        if (page > 0 && page <= Math.ceil(users.length / usersPerPage)) {
            setCurrentPage(page);
        }
    };

    const getPaginationPages = (currentPage, totalPages) => {
        const maxVisiblePages = 3; // Số trang liền kề hiển thị
        const pages = [];

        if (totalPages <= maxVisiblePages + 2) {
            // Nếu tổng số trang ít, hiển thị tất cả
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Luôn hiển thị trang đầu
            pages.push(1);

            if (currentPage > 3) {
                // Nếu trang hiện tại cách đầu > 2, thêm "..."
                pages.push("...");
            }

            // Thêm các trang liền kề (trang hiện tại và 2 bên)
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                // Nếu trang hiện tại cách cuối > 2, thêm "..."
                pages.push("...");
            }

            // Luôn hiển thị trang cuối
            pages.push(totalPages);
        }

        return pages;
    };



    return (
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
            <div className="rounded-t mb-0 px-4 py-3 border-0">
                <div className="flex flex-wrap items-center">
                    <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                        <h3 className={
                            "font-bold text-2xl text-lg "
                        }
                            style={{ fontFamily: 'Roboto, sans-serif' }} // Áp dụng font chữ Roboto
                        >- DANH SÁCH NGƯỜI DÙNG -</h3>

                    </div>
                    {userRole === "admin" && (
                        <NavLink to={`/admin/user/add`}
                                 className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
                            Thêm Nhân Viên
                        </NavLink>
                    )}
                </div>
            </div>
            {/* Input tìm kiếm sản phẩm */}
            <div className="mb-4 px-4">
                <input
                    type="text"
                    className="border border-gray-300 rounded px-3 py-2 w-full shadow appearance-none focus:outline-none focus:shadow-outline"
                    placeholder="Tìm kiếm người dùng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} // Ensure this updates the searchTerm state
                />
            </div>
            {loading ? (
                <div className="flex justify-center items-center py-4">
                    <PulseLoader color="#4A90E2" loading={loading} size={15}/>
                </div>
            ) : (
                <div className="block w-full overflow-x-auto">
                    <table className="items-center w-full bg-transparent border-collapse table-fixed">
                        <thead>
                        <tr>
                            {userRole !== "admin" ? (
                                <th className="px-6 py-3 border border-solid text-x text-center uppercase font-bold text-left"></th>
                            ) : (
                                <th className="px-6 py-3 border border-solid text-x text-center uppercase font-bold text-left">
                                    <input
                                        type="checkbox"
                                        onChange={handleSelectAll}
                                        checked={selectedUsers.length === displayedUsers.length}
                                    />
                                </th>
                            )}
                            <th className="px-6 py-3 border border-solid text-x text-center uppercase font-bold text-left">STT</th>
                            <th className="px-6 py-3 border border-solid text-x text-center uppercase font-bold text-left">Tên</th>
                            <th className="px-6 py-3 border border-solid text-x text-center uppercase font-bold text-left">Hình
                                ảnh
                            </th>
                            <th className="px-6 py-3 border border-solid text-x text-center uppercase font-bold text-left">Email</th>
                            <th className="px-6 py-3 border border-solid text-x text-center uppercase font-bold text-left">Số
                                điện thoại
                            </th>
                            <th className="px-6 py-3 border border-solid text-x text-center uppercase font-bold text-left">Địa
                                chỉ
                            </th>
                            <th className="px-6 py-3 border border-solid text-x text-center uppercase font-bold text-left">Quyền
                                Người Dùng
                            </th>
                            {userRole !== "admin" ? (
                                <th className="px-6 py-3 border border-solid text-x text-center uppercase font-bold text-left">...</th>
                            ) : (
                                <th className="px-6 py-3 border border-solid text-x text-center uppercase font-bold text-left">Thao
                                    tác</th>
                            )
                            }
                        </tr>
                        </thead>
                        <tbody>
                        {displayedUsers.length > 0 ? (
                            displayedUsers.map((user, index) => (
                                <tr key={user.id}>
                                    <td className="border-t-0 px-6 py-5 align-middle text-center items-center">
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
                                    <td className="border-t-0 px-6 align-middle text-center whitespace-nowrap p-4">
                                        <div className="flex justify-center items-center">
                                            <span className="text-blueGray-600">{index + 1}</span>
                                        </div>
                                    </td>
                                    <td className="border-t-0 px-6 align-middle text-x text-center whitespace-nowrap p-4 ">
                                        {user.name.length > 10 ?"..." + user.name.substring(0, 10) : user.name}
                                    </td>
                                    <td className="border-t-0 px-6 align-middle text-x text-center whitespace-nowrap p-4 ">
                                        <div className="flex justify-center items-center h-full">
                                            {user.image ? (
                                                <img src={user.image} alt={user.name}
                                                     className="w-12 h-12 rounded-full"/>
                                            ) : (
                                                <i className="fas fa-user-circle text-3xl text-gray-400"/>
                                            )}
                                        </div>
                                    </td>
                                    <td className="border-t-0 px-6 align-middle text-x text-center whitespace-nowrap p-4 ">{user.email.length > 15? user.email.substring(0, 15) + "..." :user.email}</td>
                                    <td className="border-t-0 px-6 align-middle text-x text-center whitespace-nowrap p-4 ">{user.phone}</td>
                                    <td className="border-t-0 px-6 align-middle text-x text-center whitespace-nowrap p-4 ">{user.address}</td>
                                    <td className="border-t-0 px-6 align-middle text-x text-center whitespace-nowrap p-4 ">{getRoleName(user.role_id)}</td>
                                    <td className="border-t-0 px-6 align-middle text-x text-center whitespace-nowrap p-4 ">
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
            <div className="flex justify-center items-center mt-4 mb-4">
                {/* Nút Previous */}
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 mx-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>

                {/* Danh sách số trang */}
                <div className="flex space-x-1">
                    {getPaginationPages(currentPage, Math.ceil(users.length / usersPerPage)).map((page, index) =>
                        page === "..." ? (
                            <span
                                key={`ellipsis-${index}`}
                                className="w-10 h-10 flex items-center justify-center text-gray-500"
                            >
                                                ...
                                            </span>
                        ) : (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`w-10 h-10 flex items-center justify-center border rounded-full text-sm font-bold shadow ${
                                    currentPage === page
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-100 text-gray-800"
                                } hover:bg-blue-300 hover:shadow-lg transition duration-200`}
                            >
                                {page}
                            </button>
                        )
                    )}
                </div>

                {/* Nút Next */}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === Math.ceil(users.length / usersPerPage)}
                    className="px-4 py-2 mx-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    <FontAwesomeIcon icon={faChevronRight} />
                </button>
            </div>

            {userRole === "admin" && selectedUsers.length > 0 && (
                <div className="mb-4 px-4">
                    <button
                        onClick={handleDeleteSelected}
                        className="bg-red-500 text-white text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none ease-linear transition-all duration-150"
                    >
                        Xóa đã chọn
                    </button>
                </div>
            )}
        </div>
    );
}
