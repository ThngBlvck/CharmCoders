<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class VNPAYController extends Controller
{

    public function createPayment(Request $request)
    {
        $vnp_TmnCode = config('vnpay.vnp_tmn_code');
        $vnp_HashSecret = config('vnpay.vnp_hash_secret');
        $vnp_Url = config('vnpay.vnp_url');
        $vnp_Returnurl = config('vnpay.vnp_return_url');

        $vnp_TxnRef = time(); // Mã giao dịch duy nhất
        $vnp_OrderInfo = "Thanh toán đơn hàng";
        $vnp_Amount = $request->amount * 100; // Chuyển thành đơn vị VNĐ
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
            "vnp_OrderInfo" => $vnp_OrderInfo,
            "vnp_OrderType" => "billpayment",
            "vnp_ReturnUrl" => $vnp_Returnurl,
            "vnp_TxnRef" => $vnp_TxnRef,
        ];

        ksort($inputData);
        $query = "";
        $hashdata = "";
        foreach ($inputData as $key => $value) {
            $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
            $query .= urlencode($key) . "=" . urlencode($value) . '&';
        }

        $vnp_Url = $vnp_Url . "?" . $query;
        if ($vnp_HashSecret) {
            $vnpSecureHash = hash_hmac('sha512', ltrim($hashdata, '&'), $vnp_HashSecret);
            $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;
        }

        return response()->json(['url' => $vnp_Url]);
    }

    public function paymentReturn(Request $request)
    {
        $vnp_SecureHash = $request->vnp_SecureHash;
        $inputData = $request->except('vnp_SecureHash');
        ksort($inputData);
        $hashData = "";
        foreach ($inputData as $key => $value) {
            $hashData .= urlencode($key) . '=' . urlencode($value) . '&';
        }
        $hashData = trim($hashData, '&');

        $secureHash = hash_hmac('sha512', $hashData, config('vnpay.vnp_hash_secret'));

        if ($secureHash == $vnp_SecureHash && $request->vnp_ResponseCode == '00') {
            // Xử lý thanh toán thành công
            return response()->json(['status' => 'success', 'message' => 'Thanh toán thành công']);
        }

        return response()->json(['status' => 'fail', 'message' => 'Giao dịch thất bại']);
    }
}

