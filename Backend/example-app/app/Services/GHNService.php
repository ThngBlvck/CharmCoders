<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class GHNService
{
    protected $token;

    public function __construct()
    {
        $this->token = env('GHN_TOKEN'); // Lấy token từ file .env
    }

    // Tính phí vận chuyển
    public function calculateShippingFee($data)
    {
        $response = Http::withHeaders([
            'Token' => $this->token,
        ])->post('https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee', $data);

        return $response->json();
    }

    // Tạo đơn hàng trên GHN
    public function createOrder($data)
    {
        $response = Http::withHeaders([
            'Token' => $this->token,
        ])->post('https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/create', $data);

        return $response->json();
    }

    // Kiểm tra trạng thái đơn hàng
    public function getOrderStatus($orderCode)
    {
        $response = Http::withHeaders([
            'Token' => $this->token,
        ])->get('https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/detail', [
                    'order_code' => $orderCode,
                ]);

        return $response->json();
    }
}
