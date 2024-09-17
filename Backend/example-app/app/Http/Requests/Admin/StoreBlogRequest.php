<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class StoreBlogRequest extends FormRequest
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

        $rule = [
            'title' => 'required|string|max:255|unique:blogs,title',
            'content' => 'required|string',
            'user_id' => 'required|integer|exists:users,id',
            'category_id' => 'required|integer|exists:blog_categories,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ];

        if ($this->isMethod('put') || $this->isMethod('patch')) {
            $blogId = $this->route('blog');
            $rule = [
                'title' => [
                    'required',
                    'string',
                    'max:255',
                    Rule::unique('blogs', 'title')->ignore($blogId),
                ],
                'content' => 'required|string',
                'user_id' => 'required|integer|exists:users,id',
                'category_id' => 'required|integer|exists:blog_categories,id',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ];
        }
        return $rule;
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Tiêu đề là bắt buộc.',
            'title.unique' => 'Tiêu đề này đã tồn tại.',
            'content.required' => 'Nội dung là bắt buộc.',
            'user_id.required' => 'User ID là bắt buộc.',
            'user_id.exists' => 'User ID không tồn tại.',
            'category_id.required' => 'Category ID là bắt buộc.',
            'category_id.exists' => 'Category ID không tồn tại.',
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
