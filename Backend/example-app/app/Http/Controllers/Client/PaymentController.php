<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\VNPayPaymentGateway;
use App\Models\Cart; // Giả định rằng bạn có model Cart để lấy thông tin giỏ hàng
use App\Models\Product; // Giả định rằng bạn có model Cart để lấy thông tin giỏ hàng
use App\Models\User; // Giả định rằng bạn có model Cart để lấy thông tin giỏ hàng
use App\Models\Order; // Thêm model Order để lưu thông tin đơn hàng
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
        // Xác thực người dùng đã đăng nhập
        $userId = Auth::id();
        if (!$userId) {
            return response()->json(['error' => 'Bạn cần đăng nhập!'], 400);
        }

        $user = User::find($userId);
        if (!$user) {
            return response()->json(['error' => 'Người dùng không tồn tại!'], 404);
        }

        // Lấy danh sách sản phẩm trong giỏ hàng từ request
        $cartItemIds = $request->input('cart_item_ids');
        if (!$cartItemIds || !is_array($cartItemIds)) {
            return response()->json(['error' => 'Bạn cần cung cấp danh sách cart_item_ids!'], 400);
        }

        // Lấy các sản phẩm từ giỏ hàng
        $cartItems = Cart::whereIn('id', $cartItemIds)->where('user_id', $userId)->get();
        if ($cartItems->isEmpty()) {
            return response()->json(['error' => 'Không tìm thấy sản phẩm trong giỏ hàng!'], 404);
        }

        // Tính tổng tiền từ giỏ hàng
        $totalAmount = 0;
        foreach ($cartItems as $cartItem) {
            $product = Product::find($cartItem->product_id);
            if (!$product) {
                return response()->json(['error' => 'Sản phẩm không tồn tại!'], 404);
            }
            $totalAmount += $product->getPrice() * $cartItem->quantity;
        }

        // Lấy địa chỉ và phương thức thanh toán từ request và kiểm tra
        $address = $request->input('address');
        if (!$address) {
            return response()->json(['error' => 'Bạn cần cung cấp địa chỉ!'], 400);
        }

        $paymentMethod = $request->input('payment_method');


        // Kiểm tra nếu tổng tiền bị thiếu
        if ($totalAmount <= 0) {
            return response()->json(['error' => 'Thiếu thông tin thanh toán!'], 400);
        }

        $orderInfo = "Thanh toán đơn hàng"; // Thông tin đơn hàng

        // Tạo URL thanh toán thông qua cổng thanh toán
        $paymentUrl = $this->paymentGateway->createPayment($totalAmount, $orderInfo);

        // Lưu thông tin đơn hàng vào database
        $order = Order::create([
            'user_id' => $userId,
            'total_amount' => $totalAmount,
            'address' => $address,
            'payment_method' => $paymentMethod, // Lưu phương thức thanh toán
            'status' => 0, // Giả định trạng thái đơn hàng, 0 là chưa thanh toán
        ]);

        return response()->json(['url' => $paymentUrl, 'order_id' => $order->id]);
    }

    public function paymentReturn(Request $request)
    {
        // Ghi log các tham số nhận được
        \Log::info('Payment Return:', $request->all());

        // Xử lý kết quả thanh toán
        $isSuccess = $this->paymentGateway->paymentReturn($request);

        if ($isSuccess) {
            return response()->json(['status' => 'success', 'message' => 'Thanh toán thành công']);
        }

        return response()->json(['status' => 'fail', 'message' => 'Giao dịch thất bại']);
    }
}