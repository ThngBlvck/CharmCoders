<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use Twilio\Rest\Client;
use App\Models\UserOtp;
use App\Http\Requests\Client\SendOtpRequest;
use App\Http\Requests\Client\VerifyOtpRequest;

class PhoneController extends Controller
{
    public function sendOtp(SendOtpRequest $request)
{
    $phone = $request->input('phone'); // Số điện thoại khách hàng nhập

    // Chuyển đổi số bắt đầu bằng 0 thành +84
    if (substr($phone, 0, 1) === '0') {
        $phone = '+84' . substr($phone, 1);
    }

    $sid = env('TWILIO_SID');
    $authToken = env('TWILIO_AUTH_TOKEN');
    $verifySid = env('TWILIO_VERIFY_SID'); // Lấy Verify SID từ .env

    $client = new Client($sid, $authToken);
    

    try {
        // Gửi OTP qua Verify Service
        $client->verify->v2->services($verifySid)
            ->verifications
            ->create($phone, 'sms'); // Loại gửi qua SMS

        return response()->json(['message' => 'OTP đã được gửi thành công!'], 200);
    } catch (\Exception $e) {
        \Log::error('Twilio OTP Error: ' . $e->getMessage());
        return response()->json(['error' => 'Không thể gửi OTP, vui lòng thử lại.'], 500);
    }
}


public function verifyOtp(VerifyOtpRequest $request)
{
    $phone = $request->input('phone'); // Số điện thoại khách hàng

    // Chuyển đổi số bắt đầu bằng 0 thành +84
    if (substr($phone, 0, 1) === '0') {
        $phone = '+84' . substr($phone, 1);
    }

    $otp = $request->input('otp'); // OTP khách hàng nhập
    $sid = env('TWILIO_SID');
    $authToken = env('TWILIO_AUTH_TOKEN');
    $verifySid = env('TWILIO_VERIFY_SID'); // Lấy Verify SID từ .env

    $client = new Client($sid, $authToken);

    try {
        // Kiểm tra OTP qua Verify Service
        $verificationCheck = $client->verify->v2->services($verifySid)
            ->verificationChecks
            ->create([
                'to' => $phone,
                'code' => $otp,
            ]);

        if ($verificationCheck->status === 'approved') {
            // Lưu số điện thoại đã xác minh
            auth()->user()->update(['phone' => $phone]);

            return response()->json(['message' => 'Số điện thoại đã được xác minh thành công!'], 200);
        }

        return response()->json(['error' => 'OTP không hợp lệ hoặc đã hết hạn.'], 400);
    } catch (\Exception $e) {
        \Log::error('Twilio Verification Error: ' . $e->getMessage());
        return response()->json(['error' => 'Không thể xác minh OTP, vui lòng thử lại.'], 500);
    }
}

}
