<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Services\VNPayPaymentGateway;
use App\Models\Cart;
use App\Models\Product;
use App\Models\Order;
use App\Models\Order_detail;
use Auth;
use Exception;

class PaymentController extends Controller
{
    protected $vnpayService;

    public function __construct(VNPayPaymentGateway $vnpayService)
    {
        $this->vnpayService = $vnpayService; // Inject VNPayPaymentGateway Service
    }

    public function createPayment(Request $request)
    {
        // Lấy thông tin từ request
        $address = $request->input('address');
        $phone = $request->input('phone');
        $paymentMethod = $request->input('payment_method', '1'); // Phương thức thanh toán, mặc định là '1'
        $userId = Auth::id(); // Lấy ID người dùng đã đăng nhập

        // Lấy các sản phẩm trong giỏ hàng của người dùng
        $cartItems = Cart::where('user_id', $userId)->get();

        // Kiểm tra nếu giỏ hàng rỗng
        if ($cartItems->isEmpty()) {
            return response()->json([
                'message' => 'Giỏ hàng rỗng.',
            ], 422);
        }

        // Kiểm tra các item có đầy đủ thông tin
        foreach ($cartItems as $item) {
            if (!$item->price || !$item->quantity) {
                return response()->json([
                    'message' => 'Sản phẩm trong giỏ hàng không hợp lệ.',
                ], 422);
            }
        }

        // Tính tổng số tiền cần thanh toán từ các sản phẩm trong giỏ hàng
        $totalAmount = $cartItems->sum(function ($item) {
            return $item->quantity * $item->price;
        });

        // Tạo thông tin đơn hàng
        $orderInfo = "Thanh toán giỏ hàng";

        // Gọi VNPayPaymentGateway để tạo URL thanh toán
        $paymentUrl = $this->vnpayService->createPayment($totalAmount, $orderInfo);

        // Trả về URL thanh toán và các thông tin khác
        // Trước khi trả về, bạn có thể xử lý thông tin đơn hàng ngay tại đây

        // Giả sử người dùng nhập OTP thành công, bạn sẽ tự động gọi returnPayment như sau:
        $response = $this->returnPayment($request);

        return response()->json([
            'payment_url' => $paymentUrl,  // URL thanh toán VNPay
            'address' => $address,      // Địa chỉ
            'phone' => $phone,          // Số điện thoại
            'payment_method' => $paymentMethod,  // Phương thức thanh toán
            'total_amount' => $totalAmount, // Tổng số tiền
            'order_response' => $response // Thêm phản hồi từ hàm returnPayment
        ]);
    }




    public function returnPayment(Request $request)
    {
        $vnp_HashSecret = config('vnpay.hash_secret'); // Lấy cấu hình chính xác từ vnpay.php
        $inputData = $request->all();

        // Kiểm tra xem 'vnp_SecureHash' có trong mảng không
        if (!isset($inputData['vnp_SecureHash'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Thiếu vnp_SecureHash trong phản hồi'
            ]);
        }

        $vnp_SecureHash = $inputData['vnp_SecureHash'];
        unset($inputData['vnp_SecureHash']);
        ksort($inputData);

        // Tạo dữ liệu để tính toán chữ ký
        $hashData = '';
        foreach ($inputData as $key => $value) {
            $hashData .= urlencode($key) . '=' . urlencode($value) . '&';
        }
        $hashData = rtrim($hashData, '&');

        // Tính toán lại mã bảo mật
        $secureHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);

        // Kiểm tra chữ ký và mã phản hồi
        if ($secureHash == $vnp_SecureHash) {
            // Kiểm tra nếu thanh toán thành công
            if ($inputData['vnp_ResponseCode'] == '00') {
                // Cập nhật đơn hàng trong cơ sở dữ liệu
                $order = Order::where('id', $inputData['vnp_TxnRef'])->first();

                if (!$order) {
                    return response()->json([
                        'status' => 'fail',
                        'message' => 'Đơn hàng không tồn tại'
                    ]);
                }

                // Tạo đơn hàng chi tiết
                $orderDetails = [];
                $cartItems = Cart::where('user_id', Auth::id())->get();
                foreach ($cartItems as $item) {
                    $orderDetails[] = [
                        'order_id' => $order->id,
                        'product_id' => $item->product_id,
                        'quantity' => $item->quantity,
                        'price' => $item->price,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }

                Order_detail::insert($orderDetails);

                // Xóa giỏ hàng của người dùng sau khi tạo đơn hàng
                Cart::where('user_id', Auth::id())->delete();

                // Cập nhật trạng thái đơn hàng
                $order->update([
                    'status' => 1, // 1: Đã thanh toán
                    'payment_time' => now(),
                    'transaction_id' => $inputData['vnp_TransactionNo'], // Lưu mã giao dịch từ VNPay
                    'bank_code' => $inputData['vnp_BankCode'] // Lưu mã ngân hàng
                ]);

                \Log::info('Thanh toán thành công: ', ['order_id' => $order->id, 'transaction_id' => $inputData['vnp_TransactionNo']]);

                return response()->json([
                    'status' => 'success',
                    'message' => 'Thanh toán thành công',
                    'order' => $order
                ]);
            }

            return response()->json([
                'status' => 'fail',
                'message' => 'Thanh toán thất bại. Mã lỗi: ' . $inputData['vnp_ResponseCode']
            ]);
        }

        return response()->json([
            'status' => 'error',
            'message' => 'Sai chữ ký'
        ]);
    }


}
