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
        if (Auth::attempt($request->only('email', 'password'))) {
            $user = Auth::user();
            $user->tokens->each(function ($token, $key) {
                $token->delete();
            });
            if ($user->role_id == 2) {
                // Admin
                $token = $user->createToken('AdminToken', ['admin'])->accessToken;
                return response([
                    'message' => 'Đăng nhập thành công',
                    'token' => $token,
                    'role' => 'admin',
                ], 200);
            } elseif ($user->role_id == 1) {
                // User
                $token = $user->createToken('UserToken', ['user'])->accessToken;
                return response([
                    'message' => 'Đăng nhập thành công',
                    'token' => $token,
                    'role' => 'user',
                ], 200);
            } elseif ($user->role_id == 3) {
                // Employee
                $token = $user->createToken('EmployeeToken', ['employee'])->accessToken;
                return response([
                    'message' => 'Đăng nhập thành công',
                    'token' => $token,
                    'role' => 'employee',
                ], 200);
            }
        }

        return response([
            'message' => 'Đăng nhập không thành công'
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
        $user = Auth::user();

        if ($user) {
            $user->token()->revoke();

            return response()->json([
                'message' => 'Đăng xuất thành công',
            ], 200);
        }

        return response()->json([
            'message' => 'Không tìm thấy người dùng hoặc người dùng chưa đăng nhập',
        ], 401);
    }




}
