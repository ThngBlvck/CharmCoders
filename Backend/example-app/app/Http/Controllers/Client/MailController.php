<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\SendMailContact;

class MailController extends Controller
{
    public function sendMail(Request $request)
    {
        // Xác thực dữ liệu đầu vào
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'required|string|max:15',  // Thêm xác thực cho số điện thoại
            'message' => 'nullable|string',  // Cho phép message null
        ]);

        try {
            // Gửi email bằng Mail facade
            Mail::to('nguyentcpc05615@fpt.edu.vn') // Địa chỉ email nhận
                ->send(new SendMailContact(
                    $validated['name'],
                    $validated['email'],
                    $validated['phone'],  // Chuyển số điện thoại
                    $validated['message'] ?? 'No message provided' // Xử lý khi message trống
                ));

            // Trả về JSON response thành công
            return response()->json(['message' => 'Email sent successfully!'], 200);
            //dd
        } catch (\Exception $e) {
            // Nếu xảy ra lỗi, trả về JSON response báo lỗi
            return response()->json(['error' => 'Failed to send email. ' . $e->getMessage()], 500);
        }
    }
}
