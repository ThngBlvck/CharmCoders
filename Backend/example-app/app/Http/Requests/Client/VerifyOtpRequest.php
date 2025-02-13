<?php

namespace App\Http\Requests\Client;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class VerifyOtpRequest extends FormRequest
{
    public function authorize()
    {
        // Chỉ cho phép nếu người dùng đã đăng nhập
        return auth()->check();
    }

    public function rules()
    {
        return [
            'otp' => 'required|digits:6',
            'phone' => 'required|digits_between:10,15',
        ];
    }

    public function messages()
    {
        return [
            'otp.required' => 'OTP là bắt buộc.',
            'otp.digits' => 'OTP phải có đúng 6 chữ số.',
            'phone.required' => 'Số điện thoại là bắt buộc.',
            'phone.digits_between' => 'Số điện thoại không hợp lệ.',
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
