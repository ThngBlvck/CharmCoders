<?php

namespace App\Http\Requests\Client;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class AddressRequest extends FormRequest
{
    public function authorize()
    {
        // Cho phép thực hiện với tất cả người dùng đã xác thực
        return auth()->check();
    }

    public function rules()
    {
        return [
            'address' => 'required|string|max:255',
            'province' => 'required|string|max:255',
            'district' => 'required|string|max:255',
            'ward' => 'required|string|max:255',
        ];
    }

    public function messages()
    {
        return [
            'address.required' => 'Địa chỉ không được để trống.',
            'address.string' => 'Địa chỉ phải là chuỗi ký tự.',
            'address.max' => 'Địa chỉ không được vượt quá 255 ký tự.',
            
            'province.required' => 'Tỉnh/Thành phố không được để trống.',
            'province.string' => 'Tỉnh/Thành phố phải là chuỗi ký tự.',
            'province.max' => 'Tỉnh/Thành phố không được vượt quá 255 ký tự.',
            
            'district.required' => 'Quận/Huyện không được để trống.',
            'district.string' => 'Quận/Huyện phải là chuỗi ký tự.',
            'district.max' => 'Quận/Huyện không được vượt quá 255 ký tự.',
            
            'ward.required' => 'Phường/Xã không được để trống.',
            'ward.string' => 'Phường/Xã phải là chuỗi ký tự.',
            'ward.max' => 'Phường/Xã không được vượt quá 255 ký tự.',
        ];
    }

    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => $validator->errors(),
        ], 422));
    }
}
