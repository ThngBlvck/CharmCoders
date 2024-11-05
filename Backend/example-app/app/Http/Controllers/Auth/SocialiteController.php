<?php

namespace App\Http\Controllers\Auth;
use App\Http\Controllers\Controller;

use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Laravel\Passport\Token;

class SocialiteController extends Controller
{
    public function authProviderRedirect($provider)
    {
        if (in_array($provider, ['facebook', 'google'])) { // Kiểm tra provider hợp lệ
            return Socialite::driver($provider)->redirect();
        }
        return response()->json(['error' => 'Provider not supported'], 400);
    }


    public function socialAuthentication($provider)
    {
        try {
            if ($provider) {
                // Sử dụng stateless() để đảm bảo không sử dụng session
                $socialUser = Socialite::driver($provider)->stateless()->user();
                \Log::info('Social User Data: ', (array) $socialUser);

                // Đặt giá trị mặc định cho role (nếu cần)
                $role = 1; // Mặc định là người dùng

                // Sử dụng firstOrCreate để tìm hoặc tạo người dùng
                $user = User::firstOrCreate(
                    ['auth_provider_id' => $socialUser->id],
                    [
                        'name' => $socialUser->name,
                        'email' => $socialUser->email,
                        'password' => Hash::make('Password@1234'), // Đặt mật khẩu mặc định
                        'auth_provider' => $provider,
                        'role_id' => $role, // Thiết lập giá trị role mặc định
                    ]
                );

                // Đăng nhập người dùng
                Auth::login($user);

                // Tạo token Passport cho người dùng
                $token = $user->createToken('Personal Access Token')->accessToken;

                return response()->json(['token' => $token, 'user' => $user], 200);
            }
            return response()->json(['error' => 'Provider not found.'], 404);
        } catch (\Exception $e) {
            // Ghi log lỗi ra file với thông tin chi tiết
            \Log::error('Social Authentication Error: ' . $e->getMessage() . ' | Stack Trace: ' . $e->getTraceAsString());
            return response()->json(['error' => 'Lỗi xảy ra: ' . $e->getMessage()], 500);
        }
    }



}
