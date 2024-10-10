import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getProduct, deleteProduct, searchProduct } from "../../../../services/Product";
import Swal from 'sweetalert2';

export default function ProductCategoryList() {
    const [products, setProduct] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]); // State lưu sản phẩm được chọn
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, [searchTerm]);

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

    const fetchProducts = async () => {
        try {
            let result;
            if (searchTerm.trim() === "") {
                result = await getProduct();
            } else {
                const sanitizedSearchTerm = removeVietnameseTones(searchTerm);
                result = await searchProduct(sanitizedSearchTerm);
            }

            console.log("Full API result:", result);

            if (Array.isArray(result)) {
                setProduct(result);
            } else if (result && result.products && Array.isArray(result.products)) {
                setProduct(result.products);
            } else {
                setProduct([]);
            }

        } catch (error) {
            console.error("Lỗi khi lấy danh mục sản phẩm:", error);
            setProduct([]);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: "Bạn sẽ không thể khôi phục sản phẩm này!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Có!',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            try {
                await deleteProduct(id);
                setProduct(products.filter(product => product.id !== id));
                Swal.fire('Đã xóa!', 'Sản phẩm đã được xóa.', 'success');
            } catch (error) {
                console.error("Lỗi khi xóa sản phẩm:", error);
                Swal.fire('Có lỗi xảy ra!', 'Không thể xóa sản phẩm này.', 'error');
            }
        }
    };

    const handleDeleteSelected = async () => {
        const result = await Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: "Bạn sẽ không thể khôi phục các sản phẩm này!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Có!',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            try {
                await Promise.all(selectedProducts.map(id => deleteProduct(id)));
                setProduct(products.filter(product => !selectedProducts.includes(product.id)));
                setSelectedProducts([]); // Clear danh sách đã chọn
                Swal.fire('Đã xóa!', 'Các sản phẩm đã được xóa.', 'success');
            } catch (error) {
                console.error("Lỗi khi xóa sản phẩm:", error);
                Swal.fire('Có lỗi xảy ra!', 'Không thể xóa các sản phẩm này.', 'error');
            }
        }
    };

    const handleEdit = (id) => {
        navigate(`/admin/product/edit/${id}`);
    };

    const handleViewDetail = (id) => {
        navigate(`/admin/product/detail/${id}`);
    };

    const handleSelectProduct = (id) => {
        if (selectedProducts.includes(id)) {
            setSelectedProducts(selectedProducts.filter(productId => productId !== id));
        } else {
            setSelectedProducts([...selectedProducts, id]);
        }
    };

    const handleSelectAll = () => {
        if (selectedProducts.length === products.length) {
            setSelectedProducts([]);
        } else {
            setSelectedProducts(products.map(product => product.id));
        }
    };

    return (
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
            <div className="rounded-t mb-0 px-4 py-3 border-0">
                <div className="flex flex-wrap items-center">
                    <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                        <h3 className="font-semibold text-lg text-blueGray-700">SẢN PHẨM</h3>
                    </div>
                    <NavLink to={`/admin/product/add`}
                             className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                             type="button">
                        Thêm Sản Phẩm
                    </NavLink>
                </div>
            </div>

            {/* Input tìm kiếm sản phẩm */}
            <div className="mb-4 px-4">
                <input
                    type="text"
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="block w-full overflow-x-auto">
                <table className="items-center w-full bg-transparent border-collapse table-fixed">
                    <thead>
                    <tr>
                        <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">
                            <input
                                type="checkbox"
                                onChange={handleSelectAll}
                                checked={selectedProducts.length === products.length}
                            />
                        </th>
                        <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">STT</th>
                        <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">Tên</th>
                        <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">Hình ảnh</th>
                        <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">Giá gốc</th>
                        <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">Giá sale</th>
                        <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">Thao tác</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products && products.length > 0 ? (
                        products.map((product, index) => (
                            <tr key={product.id}>
                                <td className="border-t-0 px-6 py-5 align-middle text-left flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedProducts.includes(product.id)}
                                        onChange={() => handleSelectProduct(product.id)}
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
                                    {product.name.length > 30 ? product.name.substring(0, 30) + "..." : product.name}
                                </td>
                                <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4">
                                    <img src={product.image} alt={product.name} className="h-12 w-12 rounded"/>
                                </td>
                                <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4">{product.unit_price.toLocaleString()} VND</td>
                                <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4">
                                    {product.sale_price !== null ? product.sale_price.toLocaleString() + " VND" : "Không có"}
                                </td>
                                <td className="border-t-0 px-6 align-middle text-xs whitespace-nowrap p-4">
                                    <button className="text-blue-500 hover:text-blue-700 px-2"
                                            onClick={() => handleViewDetail(product.id)}>
                                        <i className="fas fa-eye text-xl"></i>
                                    </button>
                                    <button
                                        className="text-blue-500 hover:text-blue-700 ml-2 px-2"
                                        onClick={() => handleEdit(product.id)}
                                    >
                                        <i className="fas fa-pen text-xl"></i>
                                    </button>
                                    <button className="text-red-500 hover:text-red-700 ml-2 px-2"
                                            onClick={() => handleDelete(product.id)}>
                                        <i className="fas fa-trash text-xl"></i>
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center p-4">
                            Không có sản phẩm nào
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Nút xóa hàng loạt */}
            {selectedProducts.length > 0 && (
                <div className="mb-4 px-4">
                    <button
                        className="bg-red-500 text-white text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none ease-linear transition-all duration-150"
                        onClick={handleDeleteSelected}
                    >
                        Xóa các sản phẩm đã chọn
                    </button>
                </div>
            )}
        </div>
    );
}
