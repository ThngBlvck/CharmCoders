<?php

namespace App\Http\Controllers\Client;

use App\Models\Order;
use App\Models\Order_detail;
use App\Models\Cart;
use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Mail\OrderCreatedMail;
use Illuminate\Support\Facades\Mail;

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
        $extraData = $request->extraData;
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

            // Lấy thông tin từ extraData
            $extradata = json_decode($data['extraData'], true);  // Giả sử extraData chứa mảng các sản phẩm
            $user_id = $extradata[0]['user_id'];
            $address = $extradata[0]['address'];
            $user = User::find($user_id);

            $shippingFee = $data['amount'] < 500000 ? 30000 : 50000;

            // Tạo đơn hàng mới
            $orderData = [
                'order_id' => $data['orderId'],
                'user_id' => $user_id,
                'total_amount' => $data['amount'],
                'status' => 0,
                'created_at' => now(),
                'updated_at' => now(),
                'address' => $address,
                'phone' => $user ? $user->phone : null,
                'payment_method' => 2,
                'shipping_fee' => $shippingFee,
            ];

            // Lưu đơn hàng vào bảng Order
            $order = Order::create($orderData);

            // Lưu chi tiết đơn hàng
            $orderDetails = [];
            foreach ($extradata as $item) {
                // Truy vấn bảng Cart để lấy thông tin sản phẩm và số lượng
                $cartItem = Cart::where('user_id', $item['user_id'])
                    ->where('product_id', $item['product_id'])
                    ->first();

                if (!$cartItem) {
                    return response()->json(['message' => 'Sản phẩm không có trong giỏ hàng'], 404);
                }

                // Tạo chi tiết đơn hàng
                $orderDetails[] = [
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'], // Giả sử có mối quan hệ với bảng product
                    'created_at' => now(),
                    'updated_at' => now(),
                ];

                // Xóa sản phẩm khỏi giỏ hàng sau khi thanh toán
                $cartItem->delete();
            }
            Mail::to($request->input('email'))->send(new OrderCreatedMail($order));

            // Lưu chi tiết đơn hàng vào bảng OrderDetail
            Order_detail::insert($orderDetails);

            return response()->json(['message' => 'Thanh toán thành công và tạo đơn hàng mới'], 200);
        }

        // Trường hợp thanh toán không thành công
        return response()->json(['message' => 'Thanh toán thất bại'], 400);
    }

}
