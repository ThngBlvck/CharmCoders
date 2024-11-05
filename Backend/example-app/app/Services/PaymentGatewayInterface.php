<?php

namespace App\Services;

use Illuminate\Http\Request;

interface PaymentGatewayInterface
{
    public function createPayment($amount, $orderInfo);

    public function paymentReturn(Request $request): bool; // Thay đổi kiểu trả về
}

