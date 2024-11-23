<?php

namespace App\Http\Controllers\Admin;

use App\Models\Variant;
use App\Models\Product;
use App\Models\AttributeValue;
use App\Http\Requests\Admin\StoreVariantRequest; // Thêm dòng này
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Str;

class VariantController extends Controller
{
    // Hiển thị danh sách các biến thể của một sản phẩm
    public function index($productId)
    {
        $variants = Variant::where('product_id', $productId)->with('attributeValues')->get();

        if ($variants->isEmpty()) {
            return response()->json(['message' => "Không có biến thể nào thuộc sản phẩm ID {$productId}."], 404);
        }

        return response()->json($variants, 200);
    }

    // Tạo mới biến thể
    public function store(StoreVariantRequest $request, $productId)
    {
        $validatedData = $request->validated();

        // Tạo SKU nếu không có trong request
        $sku = $validatedData['sku'] ?? 'SKU-' . strtoupper(Str::random(8));

        // Tạo mới biến thể
        $variant = Variant::create([
            'product_id' => $productId,
            'sku' => $sku,
            'price' => $validatedData['price'],
            'quantity' => $validatedData['quantity'],
        ]);

        // Gắn các giá trị thuộc tính nếu có
        if (isset($validatedData['attribute_values']) && !empty($validatedData['attribute_values'])) {
            $variant->attributeValues()->attach($validatedData['attribute_values']);
        }

        // Load lại các giá trị thuộc tính để trả về phản hồi
        $variant->load('attributeValues');

        return response()->json($variant, 201);
    }

    // Cập nhật biến thể
    public function update(StoreVariantRequest $request, $productId, $variantId)
    {
        $variant = Variant::where('product_id', $productId)->findOrFail($variantId);

        $validatedData = $request->validated();

        $sku = $validatedData['sku'] ?? 'SKU-' . strtoupper(Str::random(8));

        $variant->update([
            'sku' => $sku,
            'price' => $validatedData['price'],
            'quantity' => $validatedData['quantity'],
        ]);

        // Đồng bộ lại các giá trị thuộc tính
        if (isset($validatedData['attribute_values']) && !empty($validatedData['attribute_values'])) {
            $variant->attributeValues()->sync($validatedData['attribute_values']);
        }

        return response()->json($variant);
    }

    // Xóa biến thể
    public function destroy($productId, $variantId)
    {
        $variant = Variant::where('product_id', $productId)->findOrFail($variantId);

        $variant->attributeValues()->detach(); // Hủy liên kết
        $variant->delete();

        return response()->json(['message' => 'Biến thể đã được xóa thành công.']);
    }
}
