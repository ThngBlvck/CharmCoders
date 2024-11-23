<?php

namespace App\Http\Controllers\Admin;

use App\Models\Attribute;
use App\Models\AttributeValue;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class AttributeValueController extends Controller
{
    // Hiển thị danh sách giá trị thuộc tính
    public function index($attributeId)
    {
        // Lấy tất cả giá trị thuộc tính theo attribute_id
        $attributeValues = AttributeValue::where('attribute_id', $attributeId)->get();

        if ($attributeValues->isEmpty()) {
            return response()->json(['message' => 'Không có giá trị nào cho thuộc tính này.'], 404);
        }

        return response()->json($attributeValues, 200);
    }

    // Tạo mới giá trị thuộc tính
    public function store(Request $request, $attributeId)
    {
        // Xác thực giá trị
        $request->validate([
            'value' => 'required|string|max:255|unique:attribute_values,value,NULL,id,attribute_id,' . $attributeId,
        ]);

        // Tìm thuộc tính theo ID
        $attribute = Attribute::findOrFail($attributeId);

        // Tạo mới giá trị thuộc tính
        $attributeValue = $attribute->values()->create([
            'value' => $request->input('value'),
        ]);

        return response()->json($attributeValue, 201);
    }

    // Cập nhật giá trị thuộc tính
    public function update(Request $request, $attributeId, $attributeValueId)
    {
        $request->validate([
            'value' => 'required|string|max:255',
        ]);

        // Tìm giá trị thuộc tính
        $attributeValue = AttributeValue::where('attribute_id', $attributeId)->findOrFail($attributeValueId);

        // Cập nhật giá trị thuộc tính
        $attributeValue->update([
            'value' => $request->input('value'),
        ]);

        return response()->json($attributeValue, 200);
    }

    // Xóa giá trị thuộc tính
    public function destroy($attributeId, $attributeValueId)
    {
        // Tìm giá trị thuộc tính và xóa
        $attributeValue = AttributeValue::where('attribute_id', $attributeId)->findOrFail($attributeValueId);
        $attributeValue->delete();

        return response()->json(['message' => 'Giá trị thuộc tính đã được xóa thành công.'], 200);
    }
}
