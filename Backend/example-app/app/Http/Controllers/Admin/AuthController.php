<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Http\JsonResponse;
use Laravel\Socialite\Contracts\User as SocialiteUser;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        // Kiểm tra tài khoản bình thường (không có auth_provider)
        $user = User::where('email', $request->email)
                    ->whereNull('auth_provider') // Chỉ tìm tài khoản bình thường
                    ->first();

        if (!$user) {
            // Nếu không tìm thấy tài khoản, trả về lỗi
            return response([
                'message' => 'Tài khoản không tồn tại'
            ], 404);
        }

        // Kiểm tra mật khẩu so với mật khẩu đã băm trong cơ sở dữ liệu
        if (Hash::check($request->password, $user->password)) {
            // Nếu mật khẩu đúng, tạo token mới
            $user->tokens->each(function ($token) {
                $token->delete();
            });

            // Kiểm tra role_id và tạo token với quyền tương ứng
            if ($user->role_id == 2) {
                $token = $user->createToken('AdminToken', ['admin'])->accessToken;  // Quyền admin
            } elseif ($user->role_id == 3) {
                $token = $user->createToken('EmployeeToken', ['employee'])->accessToken;  // Quyền employee
            } else {
                $token = $user->createToken('UserToken', ['user'])->accessToken;  // Quyền mặc định cho user
            }

            return response([
                'message' => 'Đăng nhập thành công',
                'token' => $token,
                'role' => $user->role_id == 2 ? 'admin' : ($user->role_id == 3 ? 'employee' : 'user'),
            ], 200);
        }


        // Nếu mật khẩu sai
        return response([
            'message' => 'Mật khẩu không đúng'
        ], 401);
    }




    public function Register(RegisterRequest $request)
    {
        try {

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role_id' => 1, // Đặt mặc định là user
            ]);
            $token = $user->createToken('app')->accessToken;
            return response([
                'message' => 'Đăng ký thành công',
                'token' => $token,
            ], 200);
        } catch (Exception $exception) {
            return response([
                'message' => $exception->getMessage()
            ], 400);
        }
    }

    public function logout(Request $request)
{
    $user = Auth::user(); // Lấy người dùng hiện tại

    if ($user) {
        // Xóa tất cả các token của người dùng
        $user->tokens->each(function ($token) {
            $token->delete();
        });

        return response()->json([
            'message' => 'Đăng xuất thành công',
        ], 200);
    }

    return response()->json([
        'message' => 'Không tìm thấy người dùng hoặc người dùng chưa đăng nhập',
    ], 401);
}





}
