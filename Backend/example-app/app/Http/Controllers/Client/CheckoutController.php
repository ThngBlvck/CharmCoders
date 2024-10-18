<?php

namespace App\Http\Controllers\Client;

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

        // Nhận danh sách cart item IDs từ request
        $cartItemIds = $request->input('cart_item_ids');
        if (!$cartItemIds || !is_array($cartItemIds)) {
            return response()->json(['error' => 'Bạn cần cung cấp danh sách cart_item_ids!'], 400);
        }

        // Lấy thông tin giỏ hàng dựa trên ID và user_id
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

    //  Nhập địa chỉ và tiến hành thanh toán
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

        return response()->json([
            'success' => 'Đang tiến hành thanh toán!',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'address' => $user->address,
            ],
            'products' => $products,
            'total_amount' => $totalAmount,
        ]);
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
        $totalAmount = $product->unit_price * $quantity;

        // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng hay chưa
        $existingCart = Cart::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->first();

        if ($existingCart) {
            // Nếu sản phẩm đã có trong giỏ hàng, cập nhật số lượng và tổng tiền
            $existingCart->quantity += $quantity;
            $existingCart->total_amount += $totalAmount;
            $existingCart->save();
        } else {
            // Nếu sản phẩm chưa có, tạo mới
            Cart::create([
                'user_id' => $user->id, // Lưu ID người dùng
                'product_id' => $productId, // Lưu ID sản phẩm
                'quantity' => $quantity, // Lưu số lượng
                'total_amount' => $totalAmount, // Lưu tổng tiền vào cột total_amount
            ]);
        }

        // Trả về thông tin thanh toán
        return response()->json([
            'success' => 'Đã thêm sản phẩm vào giỏ hàng!',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->unit_price, // Hiển thị giá từ bảng products
            ],
            'quantity' => $quantity,
            'total_amount' => $totalAmount,
        ], 200);
    }













}
