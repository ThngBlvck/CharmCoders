<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreVariantRequest extends FormRequest
{
    /**
     * Xác định liệu người dùng có quyền thực hiện yêu cầu này không.
     *
     * @return bool
     */
    public function authorize()
    {
        // Nếu chỉ có admin được phép tạo variant, bạn có thể kiểm tra quyền tại đây
        return true;  // Hoặc sử dụng auth()->user()->is_admin nếu có xác thực người dùng
    }

    /**
     * Lấy các quy tắc xác thực cho yêu cầu này.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'sku' => 'nullable|string|unique:variants,sku',  // Kiểm tra tính duy nhất của SKU
            'price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:0',
            'attribute_values' => 'nullable|array',
            'attribute_values.*' => 'exists:attribute_values,id',  // Kiểm tra các giá trị thuộc tính có tồn tại trong bảng attribute_values
        ];
    }

    /**
     * Các thông báo lỗi tùy chỉnh cho các quy tắc xác thực.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'sku.unique' => 'SKU này đã tồn tại trong hệ thống.',
            'price.required' => 'Giá là bắt buộc.',
            'quantity.required' => 'Số lượng là bắt buộc.',
            'attribute_values.*.exists' => 'Một hoặc nhiều giá trị thuộc tính không tồn tại.',
        ];
    }
}
