<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;


class StoreRoleRequest extends FormRequest
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
            'name' => 'required|string|max:255|unique:roles,name',
            'status'=> 'int',
        ];

        if ($this->isMethod('put') || $this->isMethod('patch')) {
            $id = $this->route('role');
            $rules['name'] = [
                'required',
                'string',
                'max:255',
                Rule::unique('roles')->ignore($id),
            ];
        }
        return $rules;
    }

    public function messages()
    {
        return [
            'name.required' => 'Vui lòng nhập vai trò.',
            'name.unique' => 'Vai trò đã tồn tại.',
            'name.max' => 'Không được vượt quá 255 ký tự.',
            'status.int' => 'Trạng thái phải là số nguyên.'
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
