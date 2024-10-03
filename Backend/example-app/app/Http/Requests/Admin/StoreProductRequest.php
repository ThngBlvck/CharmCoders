<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class StoreProductRequest extends FormRequest
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
    public function rules()
    {
        $rules = [
            'name' => 'required|string|max:255|unique:products,name',
            'unit_price' => 'required|numeric',
            'sale_price' => 'nullable|numeric',
            'quantity' => 'required|integer',
//             'image' => 'nullable|image|mimes:jpeg,png,jpg,gif',
            'content' => 'nullable|string',
            'views' => 'nullable|integer',
            'status' => 'required|boolean',
            'brand_id' => 'nullable|exists:brands,id',
            'category_id' => 'nullable|exists:categories,id',
        ];

        if ($this->isMethod('put') || $this->isMethod('patch')) {
            $id = $this->route('product'); // Lấy ID của sản phẩm từ route nếu có

            $rules['name'] = [
                'required',
                'string',
                'max:255',
                Rule::unique('products')->ignore($id),
            ];
        }

        return $rules;
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages()
    {
        return [
            'name.required' => 'Tên sản phẩm là bắt buộc.',
            'name.string' => 'Tên sản phẩm phải là chuỗi ký tự.',
            'name.max' => 'Tên sản phẩm không được vượt quá 255 ký tự.',
            'name.unique' => 'Tên sản phẩm đã tồn tại.',
            'unit_price.required' => 'Giá gốc là bắt buộc.',
            'unit_price.numeric' => 'Giá gốc phải là số.',
            'sale_price.numeric' => 'Giá giảm phải là số.',
            'quantity.required' => 'Số lượng sản phẩm là bắt buộc.',
            'quantity.integer' => 'Số lượng sản phẩm phải là số nguyên.',
//             'image.image' => 'File tải lên phải là một hình ảnh.',
//             'image.mimes' => 'Hình ảnh phải có định dạng: jpeg, png, jpg, gif.',
            'content.string' => 'Nội dung phải là chuỗi ký tự.',
            'views.integer' => 'Lượt xem phải là số nguyên.',
            'status.required' => 'Trạng thái sản phẩm là bắt buộc.',
            'status.boolean' => 'Trạng thái sản phẩm phải là giá trị đúng hoặc sai.',
            'brand_id.exists' => 'Thương hiệu không tồn tại.',
            'category_id.exists' => 'Danh mục không tồn tại.',
        ];
    }

    /**
     * Handle a failed validation attempt.
     *
     * @param  \Illuminate\Contracts\Validation\Validator  $validator
     * @return void
     * @throws \Illuminate\Http\Exceptions\HttpResponseException
     */
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => $validator->errors()
        ], 422));
    }
}
