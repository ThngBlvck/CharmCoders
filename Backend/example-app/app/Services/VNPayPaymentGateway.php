<?php
namespace App\Services;

use Illuminate\Support\Facades\Config;
use Illuminate\Http\Request;

class VNPayPaymentGateway implements PaymentGatewayInterface
{
    public function createPayment($amount, $orderInfo)
    {
        $vnp_TmnCode = Config::get('vnpay.vnp_tmn_code');
        $vnp_HashSecret = Config::get('vnpay.vnp_hash_secret');
        $vnp_Url = Config::get('vnpay.vnp_url');
        $vnp_Returnurl = Config::get('vnpay.vnp_return_url');

        $vnp_TxnRef = time(); // Mã giao dịch duy nhất
        $vnp_Amount = $amount * 100; // Chuyển thành VNĐ
        $vnp_Locale = 'vn';
        $vnp_IpAddr = request()->ip();

        $inputData = [
            "vnp_Version" => "2.1.0",
            "vnp_TmnCode" => $vnp_TmnCode,
            "vnp_Amount" => $vnp_Amount,
            "vnp_Command" => "pay",
            "vnp_CreateDate" => now()->format('YmdHis'),
            "vnp_CurrCode" => "VND",
            "vnp_IpAddr" => $vnp_IpAddr,
            "vnp_Locale" => $vnp_Locale,
            "vnp_OrderInfo" => $orderInfo,
            "vnp_OrderType" => "billpayment",
            "vnp_ReturnUrl" => $vnp_Returnurl,
            "vnp_TxnRef" => $vnp_TxnRef,
        ];

        ksort($inputData);
        $hashdata = '';
        foreach ($inputData as $key => $value) {
            $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
        }

        $vnp_Url .= '?' . http_build_query($inputData);
        if ($vnp_HashSecret) {
            $vnpSecureHash = hash_hmac('sha512', ltrim($hashdata, '&'), $vnp_HashSecret);
            $vnp_Url .= '&vnp_SecureHash=' . $vnpSecureHash;
        }

        return $vnp_Url;
    }

    public function paymentReturn(Request $request): bool
    {
        $vnp_SecureHash = $request->vnp_SecureHash;
        $inputData = $request->except('vnp_SecureHash');
        ksort($inputData);
        $hashData = '';
        foreach ($inputData as $key => $value) {
            $hashData .= urlencode($key) . '=' . urlencode($value) . '&';
        }
        $hashData = rtrim($hashData, '&');

        $secureHash = hash_hmac('sha512', $hashData, Config::get('vnpay.vnp_hash_secret'));

        return $secureHash == $vnp_SecureHash && $request->vnp_ResponseCode == '00'; // Trả về true/false
    }
}
