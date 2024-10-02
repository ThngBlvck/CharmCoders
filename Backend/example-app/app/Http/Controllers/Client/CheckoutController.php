<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Order_Detail;
use App\Models\Cart;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class CheckoutController extends Controller
{
    // public function checkout()

    // {
    //     DB::beginTransaction(); // Bắt đầu giao dịch

    //     try {
    //         $user = auth()->user(); // Lấy thông tin người dùng hiện tại

    //         // Lấy toàn bộ giỏ hàng của người dùng
    //         $carts = Cart::where('user_id', $user->id)->get();

    //         if ($carts->isEmpty()) {
    //             return back()->with('error', 'Giỏ hàng của bạn trống!');
    //         }

    //         // Tính tổng số tiền trong giỏ hàng
    //         $totalAmount = $carts->sum(function ($cart) {
    //             return $cart->price * $cart->quantity;
    //         });

    //         // Lấy tất cả thông tin cần thiết từ người dùng
    //         $userDetails = [
    //             'name' => $user->name,
    //             'email' => $user->email,
    //             'address' => $user->address,
    //             'phone' => $user->phone, // Giả sử bảng users có cột phone
    //             // Thêm các thông tin khác nếu cần thiết
    //         ];

    //         // Tạo đơn hàng mới trong bảng `orders`
    //         $order = Order::create([
    //             'total_amount' => $totalAmount,
    //             'address' => $user->address, // Bạn có thể nhận address từ request nếu cần
    //             'user_id' => $user->id,
    //             'status' => 1 // Đơn hàng được tạo, trạng thái có thể là 'pending'
    //         ]);

    //         // Lưu chi tiết đơn hàng trong bảng `order_details`
    //         foreach ($carts as $cart) {
    //             Order_Detail::create([
    //                 'order_id' => $order->id,
    //                 'price' => $cart->price,
    //                 'quantity' => $cart->quantity,
    //                 'discount' => 0 // Giả sử không có giảm giá
    //             ]);
    //         }

    //         // Xóa giỏ hàng sau khi chuyển dữ liệu sang bảng `orders` và `order_details`
    //         Cart::where('user_id', $user->id)->delete();

    //         DB::commit(); // Hoàn thành giao dịch

    //         // Thêm thông tin người dùng và giỏ hàng vào response
    //         return redirect()->route('orders.index')->with([
    //             'success' => 'Thanh toán thành công!',
    //             'userDetails' => $userDetails,
    //             'cartDetails' => $carts,
    //         ]);

    //     } catch (\Exception $e) {
    //         DB::rollback(); // Rollback nếu có lỗi
    //         return back()->with('error', 'Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại.');
    //     }
    // }
    public function checkout(Request $request)
    {
        DB::beginTransaction(); // Bắt đầu giao dịch để đảm bảo dữ liệu nhất quán

        try {
            // Nhận thông tin người dùng qua request
            $userId = $request->input('user_id');
            $address = $request->input('address');

            // Kiểm tra xem `user_id` có được gửi hay không
            if (!$userId) {
                return response()->json(['error' => 'Không có user_id được cung cấp!'], 400);
            }

            // Lấy toàn bộ giỏ hàng của người dùng
            $carts = Cart::where('user_id', $userId)->get();

            if ($carts->isEmpty()) {
                return response()->json(['error' => 'Giỏ hàng của bạn trống!'], 400);
            }

            // Tính tổng số tiền trong giỏ hàng
            $totalAmount = $carts->sum(function ($cart) {
                return $cart->price * $cart->quantity;
            });

            // Tạo đơn hàng mới trong bảng `orders`
            $order = Order::create([
                'total_amount' => $totalAmount,
                'address' => $address, // Nhận địa chỉ từ request
                'user_id' => $userId,
                'status' => 1 // Đơn hàng đã được tạo, có thể là 'pending' hoặc 'processing'
            ]);

            // Lưu chi tiết đơn hàng trong bảng `order_details`
            foreach ($carts as $cart) {
                Order_Detail::create([
                    'order_id' => $order->id,
                    'price' => $cart->price,
                    'quantity' => $cart->quantity,
                    'discount' => 0 // Giả sử không có giảm giá, bạn có thể điều chỉnh nếu cần
                ]);
            }

            // Xóa giỏ hàng sau khi chuyển dữ liệu sang bảng `orders` và `order_details`
            Cart::where('user_id', $userId)->delete();

            DB::commit(); // Hoàn thành giao dịch
            return response()->json(['success' => 'Thanh toán thành công!', 'order_id' => $order->id]);
        } catch (\Exception $e) {
            DB::rollback(); // Rollback nếu có lỗi
            return response()->json(['error' => 'Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại.'], 500);
        }
    }

}
