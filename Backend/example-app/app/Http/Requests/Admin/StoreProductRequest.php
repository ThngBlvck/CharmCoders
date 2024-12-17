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
            'unit_price' => 'required|numeric|min:0', // Giá gốc phải là số dương hoặc bằng 0
            'sale_price' => 'nullable|numeric|min:0|lte:unit_price', // Giá giảm phải là số dương hoặc bằng 0
            'quantity' => 'required|integer|min:0', // Số lượng phải là số nguyên và lớn hơn hoặc bằng 0
            'sku' => 'nullable|string|unique:products,sku', // SKU là chuỗi và duy nhất
            'content' => 'nullable|string',
            'views' => 'nullable|integer|min:0', // Lượt xem phải là số nguyên và lớn hơn hoặc bằng 0
            'status' => 'required|boolean',
            'brand_id' => 'nullable|exists:brands,id',
            'category_id' => 'nullable|exists:categories,id',
        ];

        // Nếu là phương thức PUT hoặc PATCH (chỉnh sửa sản phẩm)
        if ($this->isMethod('put') || $this->isMethod('patch')) {
            $id = $this->route('product'); // Lấy ID của sản phẩm từ route nếu có

            // Cập nhật quy tắc cho tên sản phẩm và SKU khi chỉnh sửa
            $rules['name'] = [
                'required',
                'string',
                'max:255',
                Rule::unique('products')->ignore($id),
            ];
            $rules['sku'] = [
                'nullable',
                'string',
                Rule::unique('products')->ignore($id),
            ];
        }

        // Kiểm tra nếu có biến thể trong request, nếu có thì yêu cầu các thuộc tính biến thể

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
            'unit_price.min' => 'Giá gốc phải lớn hơn hoặc bằng 0.',
            'sale_price.numeric' => 'Giá giảm phải là số.',
            'sale_price.min' => 'Giá giảm phải lớn hơn hoặc bằng 0.',
            'quantity.required' => 'Số lượng sản phẩm là bắt buộc.',
            'quantity.integer' => 'Số lượng sản phẩm phải là số nguyên.',
            'quantity.min' => 'Số lượng sản phẩm phải lớn hơn hoặc bằng 0.',
            'content.string' => 'Nội dung phải là chuỗi ký tự.',
            'views.integer' => 'Lượt xem phải là số nguyên.',
            'views.min' => 'Lượt xem phải lớn hơn hoặc bằng 0.',
            'status.required' => 'Trạng thái sản phẩm là bắt buộc.',
            'status.boolean' => 'Trạng thái sản phẩm phải là giá trị đúng hoặc sai.',
            'brand_id.exists' => 'Thương hiệu không tồn tại.',
            'category_id.exists' => 'Danh mục không tồn tại.',
            'sale_price.lte' => 'Giá giảm không được lớn hơn giá gốc.',
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
