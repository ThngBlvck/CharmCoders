<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
class OrderController extends Controller
{
    public function index(Request $request)
    {
        // Lấy danh sách đơn hàng, có thể thêm pagination và bộ lọc nếu cần
        $orders = Order::orderBy('created_at', 'desc')->paginate(10);

        // Trả về danh sách đơn hàng dưới dạng JSON
        return response()->json([
            'data' => $orders,
            'message' => 'Danh sách đơn hàng được lấy thành công.',
        ], 200);
    }
    public function show($id)
    {
        // Tìm đơn hàng theo ID, bao gồm các sản phẩm trong đơn hàng
        $order = Order::with('details.product', 'user')->findOrFail($id);

        // Trả về thông tin chi tiết của đơn hàng dưới dạng JSON
        return response()->json([
            'data' => $order,
            'message' => 'Chi tiết đơn hàng được lấy thành công.',
        ], 200);
    }
    public function update(Request $request, $id)
    {
        // Xác thực dữ liệu trạng thái
        $validated = $request->validate([
            'status' => 'required|string',
        ]);

        // Tìm đơn hàng theo ID
        $order = Order::findOrFail($id);

        // Cập nhật trạng thái đơn hàng
        $order->update([
            'status' => $validated['status'],
        ]);

        // Trả về phản hồi JSON sau khi cập nhật
        return response()->json([
            'message' => 'Trạng thái đơn hàng đã được cập nhật thành công.',
            'order' => $order,
        ], 200);
    }
    public function export()
    {
        // Lấy tất cả đơn hàng để xuất
        $orders = Order::all();

        // Xuất danh sách đơn hàng dưới dạng JSON (hoặc CSV, Excel tùy theo yêu cầu)
        return response()->json([
            'data' => $orders,
            'message' => 'Báo cáo đơn hàng đã được xuất thành công.',
        ], 200);
    }

}
