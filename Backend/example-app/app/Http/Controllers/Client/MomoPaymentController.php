<?php

namespace App\Http\Controllers\Client;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class MomoPaymentController extends Controller
{
    public function createPayment(Request $request)
    {
        $endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";
        $partnerCode = env('MOMO_PARTNER_CODE');
        $accessKey = env('MOMO_ACCESS_KEY');
        $secretKey = env('MOMO_SECRET_KEY');
        $orderId = time() . ""; // Mã đơn hàng
        $requestId = time() . "";
        $amount = $request->amount;
        $orderInfo = "Thanh toán đơn hàng MoMo";
        $redirectUrl = env('MOMO_REDIRECT_URL');
        $ipnUrl = env('MOMO_IPN_URL');
        $extraData = ""; 

        $rawHash = "accessKey=" . $accessKey . "&amount=" . $amount . "&extraData=" . $extraData . "&ipnUrl=" . $ipnUrl . "&orderId=" . $orderId . "&orderInfo=" . $orderInfo . "&partnerCode=" . $partnerCode . "&redirectUrl=" . $redirectUrl . "&requestId=" . $requestId . "&requestType=captureWallet";
        $signature = hash_hmac("sha256", $rawHash, $secretKey);

        $data = [
            'partnerCode' => $partnerCode,
            'accessKey' => $accessKey,
            'requestId' => $requestId,
            'amount' => $amount,
            'orderId' => $orderId,
            'orderInfo' => $orderInfo,
            'redirectUrl' => $redirectUrl,
            'ipnUrl' => $ipnUrl,
            'extraData' => $extraData,
            'requestType' => 'captureWallet',
            'signature' => $signature
        ];

        $response = Http::post($endpoint, $data);
        return $response->json();
    }

    public function handleRedirect(Request $request)
    {
        // Xử lý thông tin từ MoMo sau khi thanh toán (chẳng hạn như mã đơn hàng, trạng thái thanh toán)
        $resultCode = $request->input('resultCode');
        if ($resultCode == 0) {
            return response()->json(['message' => 'Thanh toán thành công']);
        } else {
            return response()->json(['message' => 'Thanh toán thất bại']);
        }
    }

}
