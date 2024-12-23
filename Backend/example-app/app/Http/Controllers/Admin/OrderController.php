<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Order_detail;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use App\Mail\OrderCancelled;
use Illuminate\Support\Facades\Mail;

class OrderController extends Controller
{
    public function index()
    {
        // Lấy danh sách đơn hàng kết hợp với thông tin người dùng (dùng leftJoin)
        $orders = Order::leftJoin('users', 'orders.user_id', '=', 'users.id')
            ->select('orders.*', 'users.name as user_name') // Chọn tất cả thông tin đơn hàng và tên người dùng
            ->orderBy('orders.created_at', 'desc')
            ->get();

        // Xử lý dữ liệu nếu cần, ví dụ, nếu tên người dùng không có thì gán giá trị mặc định


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
        $validated = $request->validate([
            'status' => 'required|integer',
            'cancellation_reason' => 'nullable|string|max:255',
        ]);

        DB::beginTransaction();

        try {
            $order = Order::findOrFail($id);
            $oldStatus = $order->status;
            $newStatus = $validated['status'];

            // Kiểm tra trạng thái mới phải lớn hơn trạng thái cũ
            if ($newStatus <= $oldStatus) {
                return response()->json([
                    'message' => 'Không thể cập nhật trạng thái lùi về hoặc giữ nguyên trạng thái cũ.',
                ], 400); // HTTP 400 Bad Request
            }

            // Cập nhật trạng thái đơn hàng
            $order->update(['status' => $newStatus]);
            $updatedProducts = [];

            // Lưu lý do hủy vào cơ sở dữ liệu nếu trạng thái là 4 (hủy đơn)
            // Lưu lý do hủy vào cơ sở dữ liệu nếu trạng thái là 4 (hủy đơn)
            if ($newStatus == 4 && $oldStatus != 4) {
                $order->update([
                    'cancellation_reason' => $validated['cancellation_reason'], // Lưu lý do hủy vào cơ sở dữ liệu
                ]);

                // Cập nhật lại số lượng sản phẩm sau khi hủy đơn
                $orderDetails = Order_detail::where('order_id', $id)->get();
                foreach ($orderDetails as $detail) {
                    $product = Product::find($detail->product_id);
                    if ($product) {
                        // Tăng lại số lượng sản phẩm đã bán khi hủy đơn
                        $product->increment('quantity', $detail->quantity);
                        $updatedProducts[] = [
                            'product_id' => $product->id,
                            'product_name' => $product->name,
                            'updated_quantity' => $product->quantity,
                        ];
                    }
                }

                // Gửi email thông báo hủy đơn chỉ khi lý do hủy không phải null
                if (!is_null($validated['cancellation_reason'])) {
                    Mail::to($order->email)->send(new OrderCancelled($order)); // Gửi thông báo hủy đơn
                }
            }


            // Xử lý khi đơn hoàn thành (status = 3)
            if ($newStatus == 3 && $oldStatus != 3) {
                $orderDetails = Order_detail::where('order_id', $id)->get();
                foreach ($orderDetails as $detail) {
                    $product = Product::find($detail->product_id);
                    if ($product) {
                        // Cập nhật số lượng sản phẩm đã bán khi đơn hàng hoàn thành
                        $product->increment('purchase_count', $detail->quantity);
                        $updatedProducts[] = [
                            'product_id' => $product->id,
                            'product_name' => $product->name,
                            'updated_purchase_count' => $product->purchase_count,
                        ];
                    }
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Trạng thái đơn hàng đã được cập nhật thành công.',
                'order' => $order,
                'updated_products' => $updatedProducts,
            ], 200);

        } catch (\Exception $e) {
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

    public function search(Request $request)
    {
        // Lấy từ khóa tìm kiếm từ request
        $query = $request->input('query');

        // Nếu không có từ khóa tìm kiếm, trả về lỗi
        if (!$query) {
            return response()->json([
                'success' => false,
                'message' => 'Vui lòng cung cấp từ khóa tìm kiếm.',
            ], 400);
        }

        // Tìm kiếm đơn hàng dựa trên order_id, kết hợp với thông tin người dùng (sử dụng Eager Loading hoặc Join)
        $orders = Order::leftJoin('users', 'orders.user_id', '=', 'users.id')
            ->where('orders.order_id', $query)
            ->select('orders.*', 'users.name as user_name') // Lấy thông tin đơn hàng và tên người dùng
            ->get();

        // Nếu không tìm thấy đơn hàng nào
        if ($orders->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy đơn hàng nào phù hợp.',
            ], 404);
        }

        // Trả về danh sách đơn hàng phù hợp
        return response()->json([
            'success' => true,
            'orders' => $orders,
        ], 200);
    }



}
