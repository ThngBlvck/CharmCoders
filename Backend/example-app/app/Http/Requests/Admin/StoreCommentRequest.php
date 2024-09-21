<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class StoreCommentRequest extends FormRequest
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
        $rules = [
            'product_id' => 'required|exists:products,id',
            'user_id' => 'required|exists:users,id',
            'content' => 'required|string|max:255',
            'status' => 'int',
        ];

        return $rules;
    }

    public function messages()
    {
        return [
            'product_id.required' => 'ID sản phẩm không được để trống.',
            'product_id.exists' => 'ID sản phẩm không tồn tại.',
            'product_id.unique' => 'ID sản phẩm đã tồn tại trong csdl.',
            'user_id.required' => 'ID người dùng không được để trống.',
            'user_id.exists' => 'ID người dùng không tồn tại.',
            'user_id.unique' => 'ID người dùng đã tồn tại trong csdl.',
            'content.required' => 'Nội dung bình luận không được để trống.',
            'content.string' => 'Nội dung bình luận phải là chuỗi.',
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
