<?php

namespace App\Http\Controllers\Admin;

use App\Models\Attribute;
use App\Http\Requests\Admin\StoreAttributeRequest;
use App\Http\Controllers\Controller;

class AttributeController extends Controller
{
    // Hiển thị danh sách các thuộc tính
    public function index()
    {
        $attributes = Attribute::with('values')->get();

        return response()->json($attributes, 200);
    }

    // Tạo mới một thuộc tính
    public function store(StoreAttributeRequest $request)
    {
        $validatedData = $request->validated();  // Dữ liệu đã được xác thực

        // Tạo thuộc tính mới
        $attribute = Attribute::create([
            'name' => $validatedData['name'],
        ]);

        return response()->json($attribute, 201);
    }

    // Cập nhật thuộc tính
    public function update(StoreAttributeRequest $request, $attributeId)
    {
        $attribute = Attribute::findOrFail($attributeId);

        $validatedData = $request->validated();  // Dữ liệu đã được xác thực

        // Cập nhật thuộc tính
        $attribute->update([
            'name' => $validatedData['name'],
        ]);

        return response()->json($attribute, 200);
    }

    // Xóa thuộc tính
    public function destroy($attributeId)
    {
        $attribute = Attribute::findOrFail($attributeId);

        // Xóa các giá trị thuộc tính liên quan
        $attribute->values()->delete();

        // Xóa thuộc tính
        $attribute->delete();

        return response()->json(['message' => 'Thuộc tính đã được xóa thành công.']);
    }
}
