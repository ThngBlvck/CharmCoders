<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\User;
use App\Models\Product;
use Illuminate\Http\Request;

class CheckoutController extends Controller
{
    public function checkout(Request $request)
    {
        // Nhận thông tin người dùng đã đăng nhập
        $userId = auth()->id();
        \Log::info('Auth user ID: ' . $userId);

        // Kiểm tra xem `user_id` có tồn tại hay không
        if (!$userId) {
            return response()->json(['error' => 'Không có user_id được cung cấp!'], 400);
        }

        // Lấy thông tin người dùng
        $user = User::find($userId);
        if (!$user) {
            return response()->json(['error' => 'Không tìm thấy người dùng!'], 404);
        }

        // Lấy `product_id` và `quantity` từ request
        $productId = $request->input('product_id');
        $quantity = $request->input('quantity', 1); // Mặc định số lượng là 1 nếu không có

        if (!$productId) {
            return response()->json(['error' => 'Bạn cần cung cấp product_id!'], 400);
        }

        if ($quantity <= 0) {
            return response()->json(['error' => 'Số lượng sản phẩm phải lớn hơn 0!'], 400);
        }

        // Lấy thông tin sản phẩm
        $product = Product::find($productId);
        if (!$product) {
            return response()->json(['error' => 'Sản phẩm không tồn tại!'], 404);
        }

        // Tính tổng số tiền của sản phẩm mua ngay
        $totalAmount = $product->getPrice() * $quantity;

        // Lấy địa chỉ từ request
        $address = $request->input('address');
        if (!$address) {
            return response()->json(['error' => 'Bạn cần cung cấp địa chỉ!'], 400);
        }

        // Trả về thông tin thanh toán cho sản phẩm mua ngay
        return response()->json([
            'success' => 'Đang tiếp tục thanh toán sản phẩm mua ngay!',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'address' => $address, // Địa chỉ người dùng nhập
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->getPrice(),
                'quantity' => $quantity,
            ],
            'total_amount' => $totalAmount, // Tổng tiền cho sản phẩm mua ngay
        ]);
    }

    public function buyNow(Request $request)
    {
        // Nhận thông tin người dùng đã đăng nhập
        $userId = auth()->id();
        \Log::info('Auth user ID: ' . $userId);

        // Kiểm tra xem `user_id` có tồn tại hay không
        if (!$userId) {
            return response()->json(['error' => 'Không có user_id được cung cấp!'], 400);
        }

        // Lấy thông tin người dùng
        $user = User::find($userId);
        if (!$user) {
            return response()->json(['error' => 'Không tìm thấy người dùng!'], 404);
        }

        // Lấy product_id và số lượng từ request
        $productId = $request->input('product_id');
        $quantity = $request->input('quantity', 1); // Mặc định số lượng là 1 nếu không được cung cấp

        if (!$productId) {
            return response()->json(['error' => 'Bạn cần cung cấp product_id!'], 400);
        }

        // Lấy thông tin sản phẩm
        $product = Product::find($productId);
        if (!$product) {
            return response()->json(['error' => 'Sản phẩm không tồn tại!'], 404);
        }

        // Kiểm tra số lượng có hợp lệ hay không
        if ($quantity < 1) {
            return response()->json(['error' => 'Số lượng phải lớn hơn hoặc bằng 1!'], 400);
        }

        // Tính tổng tiền dựa trên giá sản phẩm và số lượng
        $totalAmount = $product->getPrice() * $quantity;

        // Trả về thông tin thanh toán
        return response()->json([
            'success' => 'Đang tiếp tục thanh toán sản phẩm mua ngay!',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->getPrice(), // Gọi phương thức getPrice
            ],
            'quantity' => $quantity,
            'total_amount' => $totalAmount,
        ], 200);
    }

    //TÍnh toàn bộ giỏ hàng
    public function checkoutCart(Request $request)
    {
        // Nhận thông tin người dùng đã đăng nhập
        $userId = auth()->id();
        \Log::info('Auth user ID: ' . $userId);

        // Kiểm tra xem `user_id` có tồn tại hay không
        if (!$userId) {
            return response()->json(['error' => 'Không có user_id được cung cấp!'], 400);
        }

        // Lấy toàn bộ giỏ hàng của người dùng
        $carts = Cart::where('user_id', $userId)->get();

        if ($carts->isEmpty()) {
            return response()->json(['error' => 'Giỏ hàng của bạn trống!'], 400);
        }

        // Lấy địa chỉ từ request
        $address = $request->input('address');
        if (!$address) {
            return response()->json(['error' => 'Bạn cần cung cấp địa chỉ!'], 400);
        }

        // Tính tổng số tiền trong giỏ hàng
        $totalAmount = $carts->sum(function ($cart) {
            return $cart->product->getPrice() * $cart->quantity;
        });

        // Trả về thông tin thanh toán cho toàn bộ giỏ hàng
        return response()->json([
            'success' => 'Đang tiếp tục thanh toán giỏ hàng!',
            'user' => [
                'id' => auth()->id(),
                'name' => auth()->user()->name,
                'email' => auth()->user()->email,
            ],
            'address' => $address, // Địa chỉ người dùng nhập
            'cart_items' => $carts->map(function ($cart) {
                return [
                    'product_id' => $cart->product->id,
                    'name' => $cart->product->name,
                    'price' => $cart->product->getPrice(),
                    'quantity' => $cart->quantity,
                    'total_price' => $cart->product->getPrice() * $cart->quantity,
                ];
            }),
            'total_amount' => $totalAmount, // Tổng tiền cho toàn bộ giỏ hàng
        ]);
    }


}
