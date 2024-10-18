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

    // Xác minh OTP và đặt lại mật khẩu
    // Xác minh OTP và đặt lại mật khẩu
    public function resetPasswordWithOtp(Request $request)
    {
        // Xác thực dữ liệu đầu vào
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'otp' => 'required|numeric',
            'password' => 'required|min:6|confirmed',
        ]);

        // Kiểm tra OTP trong bảng password_reset_tokens
        $otpRecord = DB::table('password_reset_tokens')->where('email', $request->email)->first();

        if (!$otpRecord || $otpRecord->token !== $request->otp) {
            return response()->json(['message' => 'Invalid OTP'], 400);
        }

        // Kiểm tra thời hạn OTP (ví dụ: 10 phút)
        if (Carbon::parse($otpRecord->created_at)->addMinutes(value: 10)->isPast()) {
            return response()->json(['message' => 'OTP has expired'], 400);
        }

        // Đặt lại mật khẩu cho người dùng
        $user = User::where('email', $request->email)->first();
        $user->password = Hash::make($request->password);
        $user->save();

        // Xóa OTP sau khi sử dụng
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Password has been reset successfully'], 200);
    }


    public function verifyOtp(Request $request)
    {
        // Xác thực OTP
        $request->validate([
            'otp' => 'required|numeric',
        ]);

        // Tìm bản ghi OTP trong bảng password_reset_tokens
        $otpRecord = DB::table('password_reset_tokens')->where('token', $request->otp)->first();

        if (!$otpRecord) {
            return response()->json(['message' => 'Invalid OTP'], 400);
        }

        // Kiểm tra nếu OTP đã hết hạn (ví dụ: 10 phút)
        if (Carbon::parse($otpRecord->created_at)->addMinutes(10)->isPast()) {
            return response()->json(['message' => 'OTP has expired'], 400);
        }

        // Trả về thành công và email được tìm thấy để đặt lại mật khẩu
        return response()->json([
            'message' => 'OTP verified successfully. Now you can reset the password.',
            'email' => $otpRecord->email // email để sử dụng trong bước đặt lại mật khẩu
        ], 200);
    }





    public function resetPassword(Request $request)
    {
        // Xác thực dữ liệu đầu vào
        $request->validate([
            'email' => 'required|email|exists:users,email', // hoặc token nếu sử dụng token
            'password' => 'required|min:6|confirmed',
        ]);

        // Tìm người dùng dựa trên email
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Đặt lại mật khẩu
        $user->password = Hash::make($request->password);
        $user->save();

        // Xóa OTP sau khi sử dụng
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Password has been reset successfully'], 200);
    }



}
