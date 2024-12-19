<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Http\Requests\Client\StoreOrderRequest; // Import request cho việc xác thực
use App\Models\Order;
use App\Models\Cart;
use App\Models\Order_detail;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Mail\OrderCreatedMail;
use Illuminate\Support\Facades\Mail;
class OrderController extends Controller
{
    // Tạo đơn hàng
    public function store(Request $request)
    {
        DB::beginTransaction();

        try {
            // Lấy cart_ids từ request
            $cartIds = $request->input('cart_ids');
            if (is_string($cartIds)) {
                $cartIds = json_decode($cartIds, true);
            }

            if (!$cartIds || !is_array($cartIds)) {
                return response()->json(['message' => 'Danh sách sản phẩm (cart_ids) không hợp lệ.'], 422);
            }

            $userId = Auth::id();

            if (!$userId) {
                return response()->json(['message' => 'Người dùng chưa đăng nhập.'], 401);
            }

            // Lấy các sản phẩm trong giỏ hàng
            $cartItems = Cart::where('user_id', $userId)
                ->whereIn('id', $cartIds)
                ->get();

            if ($cartItems->isEmpty()) {
                return response()->json(['message' => 'Không tìm thấy sản phẩm nào trong giỏ hàng.'], 404);
            }

            // Lấy danh sách sản phẩm để kiểm tra tồn kho
            $productIds = $cartItems->pluck('product_id')->toArray();
            $products = Product::whereIn('id', $productIds)->get()->keyBy('id');

            foreach ($cartItems as $item) {
                $product = $products->get($item->product_id);

                if (!$product) {
                    return response()->json(['message' => "Sản phẩm với ID {$item->product_id} không tồn tại."], 422);
                }

                if ($product->quantity < $item->quantity) {
                    return response()->json(['message' => "Sản phẩm {$product->name} không đủ số lượng trong kho."], 409);
                }

                // Cập nhật số lượt mua (purchase_count)
                $product->increment('purchase_count', $item->quantity);
            }

            // Tính tổng tiền sản phẩm
            $totalAmount = $cartItems->sum(function ($item) {
                return $item->quantity * $item->price;
            });

            // Tính phí ship
            $shippingFee = $totalAmount < 500000 ? 30000 : 50000;


            // Tạo đơn hàng
            $order = Order::create([
                'order_id' => $request->input('order_id'),
                'total_amount' => $totalAmount + $shippingFee,
                'shipping_fee' => $shippingFee,
                'address' => $request->input('address'),
                'status' => 0, // Trạng thái mặc định
                'user_id' => $userId,
                'payment_method' => $request->input('payment_method'),
                'phone' => $request->input('phone'),
            ]);

            // Lưu chi tiết đơn hàng và cập nhật kho
            $orderDetails = $cartItems->map(function ($item) use ($order, $products) {
                $product = $products->get($item->product_id);
                $product->decrement('quantity', $item->quantity);

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

            // Xóa các sản phẩm trong giỏ hàng
            Cart::whereIn('id', $cartIds)->delete();

            // Gửi email xác nhận
            Mail::to($request->input('email'))->send(new OrderCreatedMail($order));

            DB::commit();

            return response()->json([
                'message' => 'Đơn hàng đã được tạo thành công.',
                'order' => $order,
            ], 201);

        } catch (\Exception $e) {
            DB::rollback();
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
        $userId = Auth::id();

        // Lấy danh sách đơn hàng của người dùng cùng với chi tiết
        $orders = Order::where('user_id', $userId)
            ->with('details.product') // Tải chi tiết đơn hàng và sản phẩm
            ->orderBy('created_at', 'desc')
            ->get();

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
        $userId = Auth::id();

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
        $userId = Auth::id();

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
