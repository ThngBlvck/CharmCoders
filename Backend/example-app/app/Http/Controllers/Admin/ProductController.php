<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
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
            ->orderBy('products.created_at', 'desc')
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

        // Tạo sản phẩm
        $product = Product::create($validatedData);

        return response()->json([
            'success' => true,
            'message' => 'Sản phẩm đã được tạo thành công.',
            'data' => $product,
        ], 201);
    }

    // Hiển thị chi tiết sản phẩm
    public function show($id)
    {
        $product = Product::with(['brand', 'category'])->findOrFail($id);

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

        // Cập nhật sản phẩm
        $product->update($validatedData);

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
            $product->delete();
        });

        return response()->json([
            'success' => true,
            'message' => 'Sản phẩm đã được xóa thành công.',
        ], 200);
    }
}
