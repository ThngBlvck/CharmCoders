<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class StoreImageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'product_id' => 'required|exists:products,id', // Kiểm tra ID sản phẩm có tồn tại
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp', // Quy tắc cho từng ảnh
        ];

        if ($this->isMethod('put') || $this->isMethod('patch')) {
            $id = $this->route('image');

            // Trong trường hợp sửa, bạn có thể thêm quy tắc khác nếu cần
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'product_id.required' => 'ID sản phẩm là bắt buộc.',
            'product_id.exists' => 'Sản phẩm không tồn tại.',
            'images.*.image' => 'Mỗi tệp phải là một hình ảnh.',
            'images.*.mimes' => 'Hình ảnh phải có định dạng jpeg, png, jpg, gif, hoặc svg, webp.',
        ];
    }

    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Dữ liệu không hợp lệ.',
            'errors' => $validator->errors()
        ], 422));
    }
}
