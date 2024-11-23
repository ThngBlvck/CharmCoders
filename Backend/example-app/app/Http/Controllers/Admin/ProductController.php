<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\AttributeValue;
use App\Http\Requests\Admin\StoreProductRequest;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    // Hiển thị danh sách sản phẩm
    public function index()
    {
        $products = Product::leftJoin('categories', 'products.category_id', '=', 'categories.id')
            ->select('products.*', 'categories.name as category_name')
            ->get();

        $products->transform(function ($product) {
            $product->category_name = $product->category_name ?? 'Chưa phân loại';
            return $product;
        });

        return response()->json($products);
    }

    // Tạo sản phẩm mới
    public function store(StoreProductRequest $request)
    {
        // Xác thực dữ liệu
        $validatedData = $request->validated();

        // Xử lý hình ảnh nếu có
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->storeAs('public/images/products', $imageName);
            $validatedData['image'] = asset('storage/images/products/' . $imageName);
        }

        // Tạo sản phẩm và xử lý biến thể trong giao dịch
        DB::transaction(function () use ($validatedData, $request) {
            // Tạo sản phẩm
            $product = Product::create($validatedData);

            // Kiểm tra và xử lý biến thể sản phẩm nếu có
            if ($request->filled('has_variants') && $request->boolean('has_variants') && $request->has('variants')) {
                // Lấy dữ liệu biến thể và kiểm tra định dạng
                $variants = $request->input('variants');
                if (!is_array($variants)) {
                    $variants = json_decode($variants, true); // Giải mã JSON nếu cần
                }

                if (!is_array($variants)) {
                    throw new \InvalidArgumentException('Dữ liệu biến thể không hợp lệ.');
                }

                // Gọi hàm xử lý biến thể
                $this->handleVariants($product, $variants, $validatedData);
            }
        });

        return response()->json([
            'success' => true,
            'message' => 'Sản phẩm và biến thể đã được tạo thành công.',
            'data' => $validatedData,
        ], 201);
    }

    // Xử lý logic thêm biến thể
    private function handleVariants(Product $product, $variants, $defaultData)
    {
        // Kiểm tra nếu biến thể không phải chuỗi
        if (!is_array($variants)) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu biến thể không hợp lệ.',
            ], 400);
        }

        foreach ($variants as $variantData) {
            // Kiểm tra nếu thuộc tính cũng là mảng
            if (isset($variantData['attributes']) && !is_array($variantData['attributes'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dữ liệu thuộc tính không hợp lệ.',
                ], 400);
            }

            // Tạo hoặc cập nhật biến thể
            $variant = $product->variants()->updateOrCreate(
                ['sku' => $variantData['sku'] ?? Str::uuid()],
                [
                    'price' => $variantData['price'] ?? $defaultData['unit_price'],
                    'quantity' => $variantData['quantity'] ?? $defaultData['quantity'],
                ]
            );

            // Kiểm tra nếu có dữ liệu thuộc tính và giá trị thuộc tính
            if (isset($variantData['attributes']) && is_array($variantData['attributes'])) {
                foreach ($variantData['attributes'] as $index => $attributeId) {
                    // Kiểm tra nếu có dữ liệu giá trị thuộc tính (attributes_value)
                    if (isset($variantData['attributes_value'][$index])) {
                        $attributeValueId = $variantData['attributes_value'][$index];
                        $attributeValue = AttributeValue::where('id', $attributeValueId)
                            ->where('attribute_id', $attributeId)
                            ->first();

                        if ($attributeValue) {
                            $variant->attributeValues()->syncWithoutDetaching([$attributeValue->id]);
                        }
                    } else {
                        // Nếu không có giá trị thuộc tính, bạn có thể xử lý mặc định ở đây nếu cần
                        // Hoặc bạn có thể tạo giá trị mặc định nếu cần thiết
                    }
                }
            }
        }
    }




    // Hiển thị chi tiết sản phẩm
    public function show($id)
    {
        $product = Product::findOrFail($id);

        // Tăng lượt xem sử dụng phương thức increment()
        $product->increment('views');

        return response()->json($product);
    }

    // Cập nhật sản phẩm
    public function update(StoreProductRequest $request, $id)
    {
        $product = Product::findOrFail($id);

        $validatedData = $request->validated();

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->storeAs('public/images/products', $imageName);
            $validatedData['image'] = asset('storage/images/products/' . $imageName);
        }

        DB::transaction(function () use ($product, $validatedData, $request) {
            // Cập nhật sản phẩm
            $product->update($validatedData);

            // Cập nhật hoặc thêm mới các biến thể nếu có
            if ($product->has_variants && $request->has('variants')) {
                foreach ($request->variants as $variantData) {
                    $variant = $product->variants()->updateOrCreate(
                        ['sku' => $variantData['sku']],
                        [
                            'price' => $variantData['price'],
                            'quantity' => $variantData['quantity'],
                        ]
                    );

                    if (isset($variantData['attributes'])) {
                        $attributeValues = AttributeValue::whereIn('id', $variantData['attributes'])->get();

                        foreach ($attributeValues as $attributeValue) {
                            $variant->attributes()->updateOrCreate(
                                ['attribute_value_id' => $attributeValue->id],
                                ['attribute_id' => $attributeValue->attribute_id]
                            );
                        }
                    }
                }
            }
        });

        return response()->json([
            'success' => true,
            'message' => 'Sản phẩm đã được cập nhật thành công.',
        ], 200);
    }

    // Xóa sản phẩm
    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        DB::transaction(function () use ($product) {
            if ($product->image) {
                Storage::disk('public')->delete(str_replace(asset('storage'), '', $product->image));
            }
            $product->variants()->delete();
            $product->delete();
        });

        return response()->json([
            'success' => true,
            'message' => 'Sản phẩm đã được xóa thành công.',
        ], 200);
    }

    // Hiển thị danh sách biến thể của sản phẩm
    public function showVariants($id)
    {
        $product = Product::with('variants.attributes')->find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy sản phẩm với ID được cung cấp.',
            ], 404);
        }

        if (!$product->has_variants) {
            return response()->json([
                'success' => false,
                'message' => 'Sản phẩm này không có biến thể.',
            ], 400);
        }

        return response()->json([
            'success' => true,
            'data' => $product->variants,
        ]);
    }
}
