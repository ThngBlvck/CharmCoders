<?php

namespace App\Http\Requests\Client;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Auth;

class ChangePasswordRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Cho phép request này được thực thi
    }

    public function rules()
    {
        // Kiểm tra nếu người dùng có đăng nhập qua mạng xã hội
        $user = Auth::user();
        
        if ($user && $user->auth_provider !== null) {
            // Nếu tài khoản đăng nhập qua mạng xã hội, không cho phép thay đổi mật khẩu
            return [
                'password' => 'required|string|min:5|confirmed', // Nếu vẫn muốn cho phép thay đổi mật khẩu thông qua form (nếu cần)
            ];
        }

        // Nếu tài khoản không phải của mạng xã hội, cho phép đổi mật khẩu
        return [
            'current_password' => 'required|string|min:5', // Mật khẩu hiện tại
            'password' => 'required|string|min:5|confirmed', // Mật khẩu mới
        ];
    }

    // Tùy chỉnh thông báo lỗi
    public function messages()
    {
        return [
            'current_password.required' => 'Vui lòng nhập mật khẩu hiện tại.',
            'password.required' => 'Vui lòng nhập mật khẩu mới.',
            'password.min' => 'Mật khẩu mới phải có ít nhất 5 ký tự.',
            'password.confirmed' => 'Mật khẩu xác nhận không khớp.',
            'auth_provider' => 'Không thể thay đổi mật khẩu cho tài khoản mạng xã hội.',
        ];
    }

    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Dữ liệu không hợp lệ.',
            'errors' => $validator->errors(),
        ], 422));
    }
}
