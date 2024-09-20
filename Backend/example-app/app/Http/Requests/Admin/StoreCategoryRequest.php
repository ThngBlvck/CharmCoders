<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class StoreCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'name' => 'required|string|max:255|unique:categories,name',
            'status' => 'boolean', // Thêm kiểm tra status, 0 là hiện, 1 là ẩn
        ];

        if ($this->isMethod('put') || $this->isMethod('patch')) {
            $id = $this->route('category'); // Lấy ID của danh mục khi cập nhật

            $rules['name'] = [
                'required',
                'string',
                'max:255',
                Rule::unique('categories')->ignore($id),
            ];
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Tên danh mục là bắt buộc.',
            'name.string' => 'Tên danh mục phải là một chuỗi ký tự hợp lệ.',
            'name.max' => 'Tên danh mục không được vượt quá 255 ký tự.',
            'name.unique' => 'Tên danh mục đã tồn tại.',
            'status.boolean' => 'Trạng thái phải là 0 (hiện) hoặc 1 (ẩn).',
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
