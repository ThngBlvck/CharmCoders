<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\VNPayPaymentGateway;
use App\Models\Cart;
use App\Models\Product;
use App\Models\Order;
use App\Models\Order_detail;
use Auth;

class PaymentController extends Controller
{
    protected $paymentGateway;

    public function __construct(VNPayPaymentGateway $paymentGateway)
    {
        $this->paymentGateway = $paymentGateway;
    }

    public function checkout(Request $request)
    {
        $userId = Auth::id();
        if (!$userId) {
            return response()->json(['error' => 'Bạn cần đăng nhập!'], 400);
        }

        $cartItemIds = $request->input('cart_item_ids');
        if (!$cartItemIds || !is_array($cartItemIds)) {
            return response()->json(['error' => 'Bạn cần cung cấp danh sách cart_item_ids!'], 400);
        }

        $address = $request->input('address');
        if (!$address) {
            return response()->json(['error' => 'Bạn cần cung cấp địa chỉ!'], 400);
        }

        $paymentMethod = $request->input('payment_method');

        $totalAmount = $this->calculateTotalAmount($cartItemIds, $userId);

        if ($totalAmount <= 0) {
            return response()->json(['error' => 'Thiếu thông tin thanh toán!'], 400);
        }

        $paymentUrl = $this->paymentGateway->createPayment($totalAmount, "Thanh toán đơn hàng");

        return response()->json(['url' => $paymentUrl]);
    }

    public function paymentReturn(Request $request)
    {
        \Log::info('Payment Return:', $request->all());

        $isSuccess = $this->paymentGateway->paymentReturn($request);

        if ($isSuccess) {
            $userId = Auth::id();
            if (!$userId) {
                return response()->json(['error' => 'Bạn cần đăng nhập!'], 400);
            }

            $address = $request->input('address');
            $paymentMethod = $request->input('payment_method');

            // Lấy các sản phẩm trong giỏ hàng
            $cartItems = Cart::where('user_id', $userId)->get();
            if ($cartItems->isEmpty()) {
                return response()->json(['error' => 'Không tìm thấy sản phẩm trong giỏ hàng!'], 404);
            }

            // Tính tổng tiền của giỏ hàng
            $totalAmount = $cartItems->sum(function ($item) {
                return $item->quantity * $item->price;
            });

            // Tạo đơn hàng mới
            $order = Order::create([
                'user_id' => $userId,
                'total_amount' => $totalAmount,
                'address' => $address,
                'payment_method' => $paymentMethod,
                'status' => 1, // Đơn hàng đã được thanh toán
            ]);

            // Lưu chi tiết đơn hàng và cập nhật kho
            $orderDetails = $cartItems->map(function ($item) use ($order) {
                // Lấy sản phẩm từ bảng products
                $product = Product::find($item->product_id);

                if (!$product || $product->quantity < $item->quantity) {
                    throw new \Exception("Sản phẩm {$product->name} không đủ số lượng trong kho.");
                }

                // Trừ số lượng sản phẩm trong kho và tăng lượt mua
                $product->decrement('quantity', $item->quantity);
                // $product->increment('purchase_count', $item->quantity);

                // Tạo chi tiết đơn hàng
                return [
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            })->toArray();

            // Lưu chi tiết đơn hàng vào bảng Order_detail
            Order_detail::insert($orderDetails);

            // Xóa giỏ hàng của người dùng sau khi tạo đơn hàng
            Cart::where('user_id', $userId)->delete();

            return response()->json(['status' => 'success', 'message' => 'Thanh toán thành công', 'order_id' => $order->id]);
        }

        return response()->json(['status' => 'fail', 'message' => 'Giao dịch thất bại']);
    }


    private function calculateTotalAmount($cartItemIds, $userId)
    {
        $totalAmount = 0;
        $cartItems = Cart::whereIn('id', $cartItemIds)->where('user_id', $userId)->get();

        foreach ($cartItems as $cartItem) {
            $product = Product::find($cartItem->product_id);
            if ($product) {
                $totalAmount += $product->getPrice() * $cartItem->quantity;
            }
        }

        return $totalAmount;
    }
}
