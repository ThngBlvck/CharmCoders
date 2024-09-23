<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Http\Requests\StoreOrderRequest;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::all(); // Lấy tất cả các đơn hàng
        return response()->json([
            'success' => true,
            'data' => $orders,
            'message' => 'Danh sách đơn hàng được lấy thành công.',
        ], 200);
    }
    public function store(Request $request)
    {
        // Xác thực dữ liệu đầu vào, bao gồm user_id
        $validated = $request->validate([
            'total_amount' => 'required|numeric|min:0',
            'address' => 'required|string|max:255',
            'status' => 'required',
            'user_id' => 'required|exists:users,id', // Xác thực user_id hợp lệ
        ]);

        // Tạo đơn hàng mới
        $order = Order::create([
            'total_amount' => $validated['total_amount'],
            'address' => $validated['address'],
            'status' => $validated['status'],
            'user_id' => $validated['user_id'], // Nhập user_id từ request
        ]);

        // Trả về phản hồi JSON sau khi thêm thành công
        return response()->json([
            'message' => 'Đơn hàng đã được tạo thành công.',
            'order' => $order, // Trả về toàn bộ order, bao gồm ID
        ], 201);
    }


    public function show($id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy đơn hàng.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $order,
            'message' => 'Thông tin đơn hàng.',
        ], 200);
    }

    public function update(Request $request, $id) // Thêm $id để xác định đơn hàng cụ thể
    {
        // Xác thực dữ liệu đầu vào, chỉ trường status
        $validated = $request->validate([
            'status' => 'required', // Trường status là bắt buộc
        ]);

        // Tìm đơn hàng theo ID
        $order = Order::findOrFail($id);

        // Cập nhật trường status của đơn hàng
        $order->update([
            'status' => $validated['status'],
        ]);

        // Trả về phản hồi JSON sau khi cập nhật thành công
        return response()->json([
            'message' => 'Trạng thái đơn hàng đã được cập nhật thành công.',
            'order' => $order, // Trả về toàn bộ dữ liệu của đơn hàng sau khi cập nhật
        ], 200);
    }


    public function destroy($id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy đơn hàng.',
            ], 404);
        }
        $order->delete();

        return response()->json([
            'success' => true,
            'message' => 'Đơn hàng đã được xóa thành công.',
        ], 200);
    }




}
