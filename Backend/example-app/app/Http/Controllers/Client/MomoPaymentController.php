<?php

namespace App\Http\Controllers\Client;
use App\Models\Order;
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
        $orderId = $request->orderId; // Mã đơn hàng
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

    private function verifySignature($data)
    {
        $signature = $data['signature'];

        return true;
    }

    public function handleIPN(Request $request)
    {
        $data = $request->all();

        // Xác minh chữ ký MoMo (cần tạo hàm verifySignature để kiểm tra)
        if (!$this->verifySignature($data)) {
            return response()->json(['message' => 'Invalid signature'], 400);
        }

        // Kiểm tra trạng thái thanh toán
        if ($data['resultCode'] == 0) {
            // Thanh toán thành công
            $orderId = $data['orderId'];
            $order = Order::where('order_id', $orderId)->first();


            if ($order) {
                $order->status = 5 ; // Cập nhật trạng thái đơn hàng
                $order->save();
                return response()->json(['message' => 'Thanh toán thành công'], 200);
            } else {
                return response()->json(['message' => 'Không tìm thấy đơn hàng'], 404);
            }
        }

        // Trường hợp thanh toán không thành công
        return response()->json(['message' => 'Thanh toán thất bại'], 400);
    }
}
