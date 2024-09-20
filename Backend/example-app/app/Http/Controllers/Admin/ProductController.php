<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Http\Requests\Admin\StoreProductRequest;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    // Hiển thị danh sách sản phẩm
    public function index()
    {
        $products = Product::all();
        return response()->json($products);
    }

    // Tạo sản phẩm mới
    public function store(StoreProductRequest $request)
    {
        $validatedData = $request->validated();


        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->storeAs('public/images/products', $imageName);
            $validatedData['image'] = asset('Backend/storage/images/products/') . $imageName;
        }

        $product = Product::create($validatedData);
        return response()->json($product, 201);
    }

    // Hiển thị chi tiết sản phẩm
    public function show($id)
    {
        $product = Product::findOrFail($id);
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
            $validatedData['image'] = 'Backend/storage/images/products/' . $imageName;
        }

        $product->update($validatedData);
        return response()->json($product, 200);
    }

    // Xóa sản phẩm
    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Sản phẩm đã được xóa thành công.',
        ], 200);
    }
}
