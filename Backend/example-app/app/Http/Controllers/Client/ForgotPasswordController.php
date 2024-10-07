<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;

class ForgotPasswordController extends Controller
{
    /**
     * Gửi email chứa link đặt lại mật khẩu.
     */
    public function sendResetLinkEmail(Request $request)
    {
        // Xác thực email
        $request->validate(['email' => 'required|email']);

        // Gửi link đặt lại mật khẩu qua email
        $status = Password::sendResetLink($request->only('email'));

        // Kiểm tra trạng thái và trả về phản hồi cho người dùng
        if ($status === Password::RESET_LINK_SENT) {
            return response()->json(['message' => 'Link đặt lại mật khẩu đã được gửi!']);
        } else {
            return response()->json(['error' => 'Không thể gửi email đặt lại mật khẩu.'], 500);
        }
    }
}
