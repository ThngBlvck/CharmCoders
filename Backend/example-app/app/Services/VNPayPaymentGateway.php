<?php

namespace App\Services;

use Illuminate\Support\Facades\Config;
use Illuminate\Http\Request;

class VNPayPaymentGateway implements PaymentGatewayInterface
{
    /**
     * Tạo URL thanh toán VNPay
     *
     * @param float $amount Số tiền thanh toán
     * @param string $orderInfo Thông tin đơn hàng
     * @return string URL thanh toán VNPay
     */
    public function createPayment($amount, $orderInfo)
    {
        // Lấy thông tin cấu hình từ file config
        $vnp_TmnCode = Config::get('vnpay.vnp_tmn_code');
        $vnp_HashSecret = Config::get('vnpay.vnp_hash_secret');
        $vnp_Url = Config::get('vnpay.vnp_url');
        $vnp_Returnurl = Config::get('vnpay.vnp_return_url');

        // Mã giao dịch duy nhất
        $vnp_TxnRef = time(); // sử dụng thời gian làm mã giao dịch
        $vnp_Amount = $amount * 100; // Chuyển số tiền thành đồng (VNĐ)
        $vnp_Locale = 'vn'; // Ngôn ngữ giao diện thanh toán
        $vnp_IpAddr = request()->ip(); // Địa chỉ IP của người dùng

        // Dữ liệu cần gửi lên VNPay
        $inputData = [
            "vnp_Version" => "2.1.0",
            "vnp_TmnCode" => $vnp_TmnCode,
            "vnp_Amount" => $vnp_Amount,
            "vnp_Command" => "pay",
            "vnp_CreateDate" => now()->format('YmdHis'), // Ngày tạo giao dịch
            "vnp_CurrCode" => "VND",
            "vnp_IpAddr" => $vnp_IpAddr,
            "vnp_Locale" => $vnp_Locale,
            "vnp_OrderInfo" => $orderInfo,
            "vnp_OrderType" => "billpayment",
            "vnp_ReturnUrl" => $vnp_Returnurl,
            "vnp_TxnRef" => $vnp_TxnRef,
        ];

        // Sắp xếp các tham số
        ksort($inputData);

        // Tạo chuỗi dữ liệu để tính mã bảo mật
        $hashdata = '';
        foreach ($inputData as $key => $value) {
            $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
        }

        // Tạo URL gửi đến VNPay
        $vnp_Url .= '?' . http_build_query($inputData);

        // Nếu có key bảo mật, tạo mã bảo mật cho dữ liệu
        if ($vnp_HashSecret) {
            $vnpSecureHash = hash_hmac('sha512', ltrim($hashdata, '&'), $vnp_HashSecret);
            $vnp_Url .= '&vnp_SecureHash=' . $vnpSecureHash;
        }

        return $vnp_Url; // Trả về URL thanh toán VNPay
    }

    /**
     * Xử lý kết quả thanh toán VNPay
     *
     * @param Request $request
     * @return bool True nếu thanh toán thành công, False nếu không
     */
    public function paymentReturn(Request $request): bool
    {
        $vnp_SecureHash = $request->vnp_SecureHash; // Lấy mã bảo mật từ VNPay
        $inputData = $request->except('vnp_SecureHash'); // Lấy dữ liệu trả về từ VNPay

        // Sắp xếp các tham số
        ksort($inputData);

        // Tạo chuỗi dữ liệu để tính lại mã bảo mật
        $hashData = '';
        foreach ($inputData as $key => $value) {
            $hashData .= urlencode($key) . '=' . urlencode($value) . '&';
        }
        $hashData = rtrim($hashData, '&'); // Loại bỏ dấu '&' thừa

        // Tính mã bảo mật từ dữ liệu đã sắp xếp và key bảo mật
        $secureHash = hash_hmac('sha512', $hashData, Config::get('vnpay.vnp_hash_secret'));

        // So sánh mã bảo mật tính được với mã bảo mật trả về từ VNPay
        return $secureHash == $vnp_SecureHash && $request->vnp_ResponseCode == '00'; // Trả về true nếu thanh toán thành công
    }
}
