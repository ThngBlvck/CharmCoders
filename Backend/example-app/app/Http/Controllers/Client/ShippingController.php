<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\GHNService;

class ShippingController extends Controller
{
    protected $ghnService;

    public function __construct(GHNService $ghnService)
    {
        $this->ghnService = $ghnService;
    }

    public function calculateShippingFee(Request $request)
    {
        $data = $request->all();
        return $this->ghnService->calculateShippingFee($data);
    }

    public function createOrder(Request $request)
    {
        $data = $request->all();
        return $this->ghnService->createOrder($data);
    }

    public function getOrderStatus($orderCode)
    {
        return $this->ghnService->getOrderStatus($orderCode);
    }
}