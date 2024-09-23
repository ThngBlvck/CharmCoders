<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreOrderRequest extends FormRequest
{
    // Quyền của người dùng với request này
    public function authorize()
    {
        // Đặt là true nếu bạn muốn tất cả người dùng có thể sử dụng request này.
        return true;
    }

    // Quy tắc xác thực
    public function rules()
    {
        return [
            'total_amount' => 'required|numeric|min:0',
            'address' => 'required|string|max:255',
            'status' => 'required|in:pending,completed,canceled', // Thêm các trạng thái hợp lệ
            'user_id' => 'required|exists:users,id', // Xác thực user_id tồn tại trong bảng users
        ];
    }

    // Tùy chỉnh thông báo lỗi (không bắt buộc)
    public function messages()
    {
        return [
            'total_amount.required' => 'Vui lòng nhập tổng số tiền.',
            'total_amount.numeric' => 'Tổng số tiền phải là số.',
            'address.required' => 'Vui lòng nhập địa chỉ.',
            'status.required' => 'Vui lòng chọn trạng thái đơn hàng.',
            'user_id.required' => 'Vui lòng chọn người dùng hợp lệ.',
            'user_id.exists' => 'Người dùng không tồn tại.',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Dữ liệu không hợp lệ.',
            'errors' => $validator->errors()
        ], 422));
    }
}
