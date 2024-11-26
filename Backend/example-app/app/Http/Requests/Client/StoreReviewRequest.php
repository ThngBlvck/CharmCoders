<?php

namespace App\Http\Requests\Client;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreReviewRequest extends FormRequest
{
    /**
     * Xác định quyền thực hiện request.
     */
    public function authorize(): bool
    {
        // Nếu cần kiểm tra quyền, thêm logic tại đây.
        return true;
    }

    /**
     * Quy tắc xác thực của request.
     */
    public function rules(): array
    {
        $rules = [
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|nullable|string|max:1000',
        ];

        // Nếu là thêm mới thì yêu cầu product_id
        if ($this->isMethod('post')) {
            $rules['product_id'] = 'required|exists:products,id';
        }

        return $rules;
    }

    /**
     * Tùy chỉnh thông báo lỗi.
     */
    public function messages(): array
    {
        return [
            'product_id.required' => 'Sản phẩm là bắt buộc.',
            'product_id.exists' => 'Sản phẩm không tồn tại.',
            'rating.required' => 'Vui lòng cung cấp đánh giá.',
            'rating.integer' => 'Đánh giá phải là số nguyên.',
            'rating.min' => 'Đánh giá tối thiểu là 1.',
            'rating.max' => 'Đánh giá tối đa là 5.',
            'comment.required' => 'Bình luận không được trống.',
            'comment.string' => 'Bình luận phải là chuỗi ký tự.',
            'comment.max' => 'Bình luận tối đa 1000 ký tự.',
        ];
    }

    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => $validator->errors(),
        ], 422));
    }
}
