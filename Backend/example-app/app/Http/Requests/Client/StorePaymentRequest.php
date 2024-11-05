<?php

namespace App\Http\Requests\Client;

use Illuminate\Foundation\Http\FormRequest;

class StorePaymentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'cart_item_ids' => 'required|array',
            'cart_item_ids.*' => 'exists:carts,id', // Kiểm tra từng ID có tồn tại trong bảng carts
            'address' => 'required|string|max:255',
            'payment_method' => 'required|string|max:255',
        ];
    }

    public function messages()
    {
        return [
            'cart_item_ids.required' => 'Bạn cần cung cấp danh sách cart_item_ids!',
            'cart_item_ids.array' => 'cart_item_ids phải là một mảng.',
            'cart_item_ids.*.exists' => 'Một số sản phẩm không tồn tại trong giỏ hàng.',
            'address.required' => 'Bạn cần cung cấp địa chỉ!',
            'payment_method.required' => 'Bạn cần cung cấp phương thức thanh toán!',
        ];
    }
}
