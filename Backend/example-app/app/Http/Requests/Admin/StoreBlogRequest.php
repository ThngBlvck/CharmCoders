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
            'user_id' => 'nullable|integer|exists:users,id',
            'category_id' => 'nullable|integer|exists:blog_categories,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'status' => 'int',
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
                'user_id' => 'nullable|integer|exists:users,id',
                'category_id' => 'nullable|integer|exists:blog_categories,id',
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


            'image.image' => 'File tải lên phải là một hình ảnh.',
            'image.mimes' => 'Hình ảnh phải có định dạng: jpeg, png, jpg, gif.',
            'image.max' => 'Kích thước hình ảnh vượt quá 2MB.',
            'status.int' => 'Trạng thái phải là số'
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
