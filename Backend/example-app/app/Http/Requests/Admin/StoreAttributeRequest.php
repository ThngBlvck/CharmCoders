<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreAttributeRequest extends FormRequest
{
    /**
     * Xác thực nếu người dùng có quyền gửi yêu cầu này
     *
     * @return bool
     */
    public function authorize()
    {
        // Trả về true nếu tất cả người dùng đều có quyền gửi yêu cầu này
        return true;
    }

    /**
     * Các quy tắc xác thực dữ liệu
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'required|string|max:255|unique:attributes,name',  // Xác thực tên thuộc tính không trùng lặp
        ];
    }

    /**
     * Các thông báo lỗi tuỳ chỉnh
     *
     * @return array
     */
    public function messages()
    {
        return [
            'name.required' => 'Tên thuộc tính là bắt buộc.',
            'name.string' => 'Tên thuộc tính phải là chuỗi.',
            'name.max' => 'Tên thuộc tính không được vượt quá 255 ký tự.',
            'name.unique' => 'Tên thuộc tính này đã tồn tại.',
        ];
    }
}
