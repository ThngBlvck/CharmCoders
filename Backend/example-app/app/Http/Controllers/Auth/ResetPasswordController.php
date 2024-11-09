<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use App\Models\User;

class ResetPasswordController extends Controller
{
    // Gửi OTP
    public function sendOtp(Request $request)
    {
        // Kiểm tra email có tồn tại không
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        // Tạo OTP ngẫu nhiên 6 chữ số
        $otp = rand(100000, 999999);

        // Lưu OTP vào bảng password_reset_tokens
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            ['token' => $otp, 'created_at' => Carbon::now()]
        );

        // Gửi OTP qua email
        Mail::raw("Your OTP code is $otp", function ($message) use ($request) {
            $message->to($request->email)
                ->subject('Password Reset OTP');
        });

        return response()->json(['message' => 'OTP has been sent to your email'], 200);
    }

    // Xác minh OTP
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'otp' => 'required|numeric',
        ]);

        // Tìm bản ghi OTP trong bảng `password_reset_tokens`
        $otpRecord = DB::table('password_reset_tokens')
            ->where('token', $request->otp)
            ->first();

        if (!$otpRecord) {
            return response()->json(['message' => 'Invalid OTP'], 400);
        }

        // Kiểm tra nếu OTP đã hết hạn (1 phút)
        if (Carbon::parse($otpRecord->created_at)->addMinute()->isPast()) {
            return response()->json(['message' => 'OTP has expired'], 400);
        }

        // Cập nhật trạng thái `otp_verified` thành `true`
        DB::table('password_reset_tokens')
            ->where('email', $otpRecord->email)
            ->update(['otp_verified' => true]);

        return response()->json([
            'message' => 'OTP verified successfully. Now you can reset the password.',
            'email' => $otpRecord->email,
        ], 200);
    }

    // Đặt lại mật khẩu
    public function resetPassword(Request $request)
    {
        $request->validate([
            'password' => 'required|min:6|confirmed',
        ]);

        // Lấy bản ghi OTP đã xác thực trong bảng `password_reset_tokens`
        $otpRecord = DB::table('password_reset_tokens')
            ->where('otp_verified', true)
            ->orderByDesc('created_at')
            ->first();

        if (!$otpRecord) {
            return response()->json(['message' => 'OTP not verified. Please verify your OTP first.'], 400);
        }

        // Lấy người dùng từ email trong bản ghi OTP
        $user = User::where('email', $otpRecord->email)->first();

        // Kiểm tra nếu người dùng có `auth_provider_id`
        if (!is_null($user->auth_provider_id)) {
            return response()->json([
                'message' => 'Bạn không thể đặt lại mật khẩu cho tài khoản này vì nó được liên kết với nhà cung cấp xác thực bên ngoài.'
            ], 403);
        }

        // Đặt lại mật khẩu cho người dùng
        $user->password = Hash::make($request->password);
        $user->save();

        // Xóa bản ghi OTP sau khi sử dụng
        DB::table('password_reset_tokens')->where('email', $otpRecord->email)->delete();

        return response()->json(['message' => 'Password has been reset successfully'], 200);
    }
}
