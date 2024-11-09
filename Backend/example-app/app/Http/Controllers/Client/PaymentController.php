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
use Exception;

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

//         $paymentMethod = $request->input('payment_method');

        $totalAmount = $this->calculateTotalAmount($cartItemIds, $userId);

        if ($totalAmount <= 0) {
            return response()->json(['error' => 'Thiếu thông tin thanh toán!'], 400);
        }

        $paymentUrl = $this->paymentGateway->createPayment($totalAmount, "Thanh toán đơn hàng");

        return response()->json(['url' => $paymentUrl]);
    }

    public function paymentReturn(Request $request)
    {
        // Log dữ liệu từ VNPay callback để kiểm tra
        \Log::info('Payment Return Data:', $request->all());

        try {
            // Kiểm tra trạng thái thanh toán từ VNPay
            $isSuccess = $this->paymentGateway->paymentReturn($request);

            // Nếu thanh toán thất bại, trả về thông báo lỗi
            if (!$isSuccess) {
                return response()->json(['status' => 'fail', 'message' => 'Giao dịch thất bại'], 400);
            }

            // Lấy ID người dùng đã xác thực
            $userId = Auth::id();
            if (!$userId) {
                return response()->json(['status' => 'fail', 'message' => 'Bạn cần đăng nhập!'], 400);
            }

            // Kiểm tra và lấy dữ liệu cần thiết từ request
            $address = $request->input('address');
//             $paymentMethod = $request->input('payment_method');
//             if (!$address || !$paymentMethod) {
//                 return response()->json(['status' => 'fail', 'message' => 'Thông tin địa chỉ và phương thức thanh toán không đầy đủ!'], 400);
//             }

            // Lấy các sản phẩm trong giỏ hàng của người dùng
            $cartItems = Cart::where('user_id', $userId)->get();
            if ($cartItems->isEmpty()) {
            return response()->json(['status' => 'fail', 'message' => 'Không tìm thấy sản phẩm trong giỏ hàng!'], 404);
            }

            // Kiểm tra số lượng sản phẩm và cập nhật kho nếu đủ
            foreach ($cartItems as $item) {
                $product = Product::find($item->product_id);
                if (!$product || $product->quantity < $item->quantity) {
                    return response()->json(['status' => 'fail', 'message' => "Sản phẩm {$product->name} không đủ số lượng trong kho!"], 400);
                }

                // Trừ số lượng sản phẩm trong kho và tăng lượt mua
                $product->decrement('quantity', $item->quantity);
            }

            // Tính tổng tiền của giỏ hàng
            $totalAmount = $this->calculateTotalAmount($cartItems->pluck('id')->toArray(), $userId);

            // Tạo đơn hàng mới
            $order = Order::create([
                'user_id' => $userId,
                'total_amount' => $totalAmount,
                'address' => $address,
//                 'payment_method' => $paymentMethod,
                'status' => 1, // Đơn hàng đã được thanh toán
            ]);

            // Lưu chi tiết đơn hàng
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

            // Trả về phản hồi thành công với ID đơn hàng
            return response()->json(['status' => 'success', 'message' => 'Thanh toán thành công', 'order_id' => $order->id]);
        } catch (Exception $e) {
            // Log lỗi nếu có ngoại lệ xảy ra
            \Log::error('Payment Return Error:', ['error' => $e->getMessage()]);
            return response()->json(['status' => 'error', 'message' => 'Lỗi hệ thống, vui lòng thử lại sau'], 500);
        }
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
