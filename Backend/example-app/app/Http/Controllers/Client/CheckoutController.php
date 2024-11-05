<?php

namespace App\Http\Controllers\Client;

use App\Services\VNPayPaymentGateway;
use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\User;
use App\Models\Product;
use Auth;
use Illuminate\Http\Request;

class CheckoutController extends Controller
{
    public function showSelectedCartsByIds(Request $request)
    {
        $userId = Auth::id();
        if (!$userId) {
            return response()->json(['error' => 'Bạn cần đăng nhập!'], 400);
        }

        $user = User::find($userId);
        if (!$user) {
            return response()->json(['error' => 'Người dùng không tồn tại!'], 404);
        }

        $cartItemIds = $request->input('cart_item_ids');
        if (!$cartItemIds || !is_array($cartItemIds)) {
            return response()->json(['error' => 'Bạn cần cung cấp danh sách cart_item_ids!'], 400);
        }

        $cartItems = Cart::whereIn('id', $cartItemIds)->where('user_id', $userId)->get();
        if ($cartItems->isEmpty()) {
            return response()->json(['error' => 'Không tìm thấy giỏ hàng nào!'], 404);
        }

        $selectedCarts = [];
        $totalAmount = 0;

        foreach ($cartItems as $cartItem) {
            $product = Product::find($cartItem->product_id);
            if ($product) {
                $totalForItem = $product->getPrice() * $cartItem->quantity;
                $totalAmount += $totalForItem;

                $selectedCarts[] = [
                    'cart_id' => $cartItem->id,
                    'product' => [
                        'id' => $product->id,
                        'name' => $product->name,
                        'price' => $product->getPrice(),
                        'quantity' => $cartItem->quantity,
                    ],
                    'total_for_item' => $totalForItem,
                ];
            }
        }

        return response()->json([
            'success' => true,
            'selected_carts' => $selectedCarts,
            'total_amount' => $totalAmount,
        ]);
    }

    public function checkout(Request $request)
    {
        $userId = Auth::id();
        if (!$userId) {
            return response()->json(['error' => 'Bạn cần đăng nhập!'], 400);
        }

        $user = User::find($userId);
        if (!$user) {
            return response()->json(['error' => 'Người dùng không tồn tại!'], 404);
        }

        $cartItemIds = $request->input('cart_item_ids');
        if (!$cartItemIds || !is_array($cartItemIds)) {
            return response()->json(['error' => 'Bạn cần cung cấp danh sách cart_item_ids!'], 400);
        }

        $cartItems = Cart::whereIn('id', $cartItemIds)->where('user_id', $userId)->get();
        if ($cartItems->isEmpty()) {
            return response()->json(['error' => 'Không tìm thấy sản phẩm trong giỏ hàng!'], 404);
        }

        $totalAmount = 0;
        $products = [];

        foreach ($cartItems as $cartItem) {
            $product = Product::find($cartItem->product_id);
            if (!$product) {
                return response()->json(['error' => 'Sản phẩm không tồn tại!'], 404);
            }

            $totalAmount += $product->getPrice() * $cartItem->quantity;

            $products[] = [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->getPrice(),
                'quantity' => $cartItem->quantity,
            ];
        }

        // Nhập địa chỉ
        $address = $request->input('address');
        if (!$address) {
            return response()->json(['error' => 'Bạn cần cung cấp địa chỉ!'], 400);
        }

        // Lưu địa chỉ vào người dùng
        $user->address = $address;
        $user->save();

        // Xác định phương thức thanh toán
        $paymentMethod = $request->input('payment_method');
        switch ($paymentMethod) {
            case 'vnpay':
                // Gọi hàm xử lý thanh toán VNPay
                $paymentGateway = new VNPayPaymentGateway();
                $paymentResponse = $paymentGateway->createPayment($totalAmount, $user);
                break;
            case 'momo':
                // Gọi hàm xử lý thanh toán MoMo
                // $paymentGateway = new MoMoPaymentGateway();
                // $paymentResponse = $paymentGateway->createPayment($totalAmount, $user);
                break;
            case 'cod': // Thanh toán khi nhận hàng
                return response()->json([
                    'success' => 'Đặt hàng thành công! Bạn sẽ thanh toán khi nhận hàng.',
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'address' => $user->address,
                    ],
                    'products' => $products,
                    'total_amount' => $totalAmount,
                ]);
            default:
                return response()->json(['error' => 'Phương thức thanh toán không hợp lệ!'], 400);
        }

        // Xử lý phản hồi thanh toán
        if ($paymentResponse['status'] === 'success') {
            return response()->json([
                'success' => 'Đang tiến hành thanh toán!',
                'payment_url' => $paymentResponse['payment_url'],
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'address' => $user->address,
                ],
                'products' => $products,
                'total_amount' => $totalAmount,
            ]);
        } else {
            return response()->json(['error' => 'Thanh toán không thành công!'], 500);
        }
    }

    public function buyNow(Request $request)
    {
        // Kiểm tra xem người dùng đã đăng nhập hay chưa
        if (!Auth::check()) {
            return response()->json(['error' => 'Người dùng chưa đăng nhập!'], 401);
        }

        // Nhận thông tin người dùng đã đăng nhập
        $user = Auth::user();  // Lấy người dùng đã đăng nhập

        // Lấy product_id từ query parameters
        $productId = $request->input('product_id'); // Lấy từ query parameters
        if (!$productId) {
            return response()->json(['error' => 'Không có product_id được cung cấp!'], 400);
        }

        // Tìm product dựa trên product_id
        $product = Product::findOrFail($productId);

        // In product ID ra để kiểm tra
        \Log::info('Product ID được nhận: ' . $productId);

        // Lấy số lượng từ query (hoặc mặc định là 1)
        $quantity = $request->query('quantity', 1);

        // Kiểm tra số lượng hợp lệ
        if ($quantity < 1) {
            return response()->json(['error' => 'Số lượng phải lớn hơn hoặc bằng 1!'], 400);
        }

        // Tính tổng tiền từ giá sản phẩm lấy từ bảng `products`
        $totalAmount = $product->getPrice() * $quantity;

        // Lưu địa chỉ vào người dùng
        $address = $request->input('address');
        if (!$address) {
            return response()->json(['error' => 'Bạn cần cung cấp địa chỉ!'], 400);
        }

        // Cập nhật địa chỉ cho người dùng
        $user->address = $address;
        $user->save();

        // Trả về thông tin giao dịch
        return response()->json([
            'success' => true,
            'message' => 'Đặt hàng thành công!',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'address' => $user->address,
            ],
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->getPrice(),
                'quantity' => $quantity,
            ],
            'total_amount' => $totalAmount,
        ]);
    }
}
