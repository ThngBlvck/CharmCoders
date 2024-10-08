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
            'product_id' => 'required|exists:products,id' // Kiểm tra ID sản phẩm có tồn tại
        ];

        if ($this->isMethod('put') || $this->isMethod('patch')) {
            $id = $this->route('image');


        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'product_id.required' => 'ID sản phẩm là bắt buộc.',
            'product_id.exists' => 'Sản phẩm không tồn tại.',

        ];
    }

    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => $validator->errors()
        ], 422));
    }
}
