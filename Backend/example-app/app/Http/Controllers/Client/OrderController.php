<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Http\Requests\Client\StoreOrderRequest; // Import request cho việc xác thực
use App\Models\Order; // Import model Order
use App\Models\Cart; // Import model Cart
use App\Models\Order_detail; // Import model Order_detail
use Illuminate\Http\Request;

class OrderController extends Controller
{
    // Tạo đơn hàng
    public function store(StoreOrderRequest $request)
    {
        try {
            // Dữ liệu đã xác thực từ StoreOrderRequest
            $validated = $request->validated();

            // Lấy ID người dùng đã đăng nhập
            $userId = auth()->id();

            // Lấy sản phẩm từ giỏ hàng của người dùng
            $cartItems = Cart::where('user_id', $userId)->get();

            // Kiểm tra nếu giỏ hàng rỗng
            if ($cartItems->isEmpty()) {
                return response()->json([
                    'message' => 'Giỏ hàng rỗng.',
                ], 422);
            }

            // Tính tổng tiền của giỏ hàng
            $totalAmount = $cartItems->sum(function ($item) {
                return $item->quantity * $item->price;
            });

            // Tạo đơn hàng mới
            $order = Order::create([
                'total_amount' => $totalAmount,
                'address' => $validated['address'],
                'status' => 0, // Trạng thái mặc định là đang xử lý
                'user_id' => $userId,
            ]);

            // Lưu sản phẩm vào chi tiết đơn hàng
            $orderDetails = $cartItems->map(function ($item) use ($order) {
                return [
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            })->toArray();
            Order_detail::insert($orderDetails);

            // Xóa giỏ hàng của người dùng sau khi tạo đơn hàng
            Cart::where('user_id', $userId)->delete();

            return response()->json([
                'message' => 'Đơn hàng đã được tạo thành công.',
                'order' => $order,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra trong quá trình tạo đơn hàng.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // Xem danh sách đơn hàng
    public function index(Request $request)
    {
        // Lấy ID người dùng đã đăng nhập
        $userId = auth()->id();

        // Lấy danh sách đơn hàng của người dùng
        $orders = Order::where('user_id', $userId)->orderBy('created_at', 'desc')->get();

        // Trả về danh sách đơn hàng dưới dạng JSON
        return response()->json([
            'data' => $orders,
            'message' => 'Danh sách đơn hàng của bạn.',
        ], 200);
    }

    // Xem chi tiết đơn hàng
    public function show($id)
    {
        // Lấy ID người dùng đã đăng nhập
        $userId = auth()->id();

        // Tìm đơn hàng của người dùng
        $order = Order::where('id', $id)->where('user_id', $userId)->with('details.product')->first();

        if (!$order) {
            return response()->json([
                'message' => 'Đơn hàng không tồn tại hoặc bạn không có quyền truy cập.',
            ], 404);
        }

        // Trả về chi tiết đơn hàng
        return response()->json([
            'data' => $order,
            'message' => 'Chi tiết đơn hàng.',
        ], 200);
    }

    // Hủy đơn hàng
    public function cancel($id)
    {
        // Lấy ID người dùng đã đăng nhập
        $userId = auth()->id();

        // Tìm đơn hàng của người dùng
        $order = Order::where('id', $id)->where('user_id', $userId)->first();

        if (!$order || $order->status !== 'pending') {
            return response()->json([
                'message' => 'Đơn hàng không tồn tại hoặc không thể hủy.',
            ], 422);
        }

        // Cập nhật trạng thái đơn hàng thành 'canceled'
        $order->update([
            'status' => 'canceled',
        ]);

        return response()->json([
            'message' => 'Đơn hàng đã được hủy thành công.',
        ], 200);
    }
}
