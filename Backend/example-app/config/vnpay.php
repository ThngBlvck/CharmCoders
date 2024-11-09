<?php
return [
    'vnp_tmn_code' => env('VNP_TMN_CODE', 'your_vnp_tmn_code'),
    'vnp_hash_secret' => env('VNP_HASH_SECRET', 'your_secret_key'),
    'vnp_url' => env('VNP_URL', 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'),
    'vnp_return_url' => env('VNP_RETURN_URL', 'http://localhost:8000/api/client/payment-return'), // link này sẽ xử lý sau khi thanh toán thành công
];
