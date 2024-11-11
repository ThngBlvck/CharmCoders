<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Order_detail;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
class OrderController extends Controller
{
    public function index()
    {
        // Lấy danh sách đơn hàng kết hợp với thông tin người dùng (dùng leftJoin)
        $orders = Order::leftJoin('users', 'orders.user_id', '=', 'users.id')
            ->select('orders.*', 'users.name as user_name') // Chọn tất cả thông tin đơn hàng và tên người dùng
            ->get();

        // Xử lý dữ liệu nếu cần, ví dụ, nếu tên người dùng không có thì gán giá trị mặc định
        $orders->transform(function ($order) {
            $order->user_name = $order->user_name ?? 'Người dùng không xác định'; // Gán tên mặc định nếu không có tên người dùng
            return $order;
        });

        // Trả về danh sách đơn hàng dưới dạng JSON
        return response()->json($orders);
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
            'status' => 'required|integer',
        ]);

        // Bắt đầu transaction để đảm bảo tính toàn vẹn dữ liệu
        DB::beginTransaction();

        try {
            // Tìm đơn hàng theo ID
            $order = Order::findOrFail($id);

            // Kiểm tra trạng thái cũ của đơn hàng
            $oldStatus = $order->status;

            // Cập nhật trạng thái đơn hàng
            $newStatus = $validated['status'];
            $order->update([
                'status' => $newStatus,
            ]);

            $updatedProducts = []; // Mảng lưu thông tin sản phẩm cập nhật

            // Nếu trạng thái mới là 4 (hủy đơn) và trạng thái cũ khác 4
            if ($newStatus == 4 && $oldStatus != 4) {
                // Lấy các chi tiết đơn hàng để hoàn lại số lượng sản phẩm
                $orderDetails = Order_detail::where('order_id', $id)->get();

                foreach ($orderDetails as $detail) {
                    // Lấy sản phẩm từ bảng products
                    $product = Product::find($detail->product_id);

                    // Hoàn lại số lượng sản phẩm trong kho
                    if ($product) {
                        $product->increment('quantity', $detail->quantity);

                        // Thêm thông tin sản phẩm vào mảng cập nhật
                        $updatedProducts[] = [
                            'product_id' => $product->id,
                            'product_name' => $product->name,
                            'updated_quantity' => $product->quantity,
                        ];
                    }
                }
            }

            // Xác nhận thay đổi
            DB::commit();

            // Trả về phản hồi JSON sau khi cập nhật
            return response()->json([
                'message' => 'Trạng thái đơn hàng đã được cập nhật thành công.',
                'order' => $order,
                'updated_products' => $updatedProducts, // Thông tin sản phẩm cập nhật
            ], 200);

        } catch (\Exception $e) {
            // Khôi phục dữ liệu nếu có lỗi xảy ra
            DB::rollback();
            return response()->json([
                'message' => 'Có lỗi xảy ra trong quá trình cập nhật trạng thái đơn hàng.',
                'error' => $e->getMessage(),
            ], 500);
        }
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
