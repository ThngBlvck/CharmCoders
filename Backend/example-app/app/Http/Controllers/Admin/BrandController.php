<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Http\Requests\Admin\StoreBrandRequest;
use Illuminate\Support\Facades\Storage;

class BrandController extends Controller
{
    public function index()
    {

        $brands = Brand::orderBy('created_at', 'desc')->get();

        return response()->json($brands);
    }


    public function store(StoreBrandRequest $request)
    {
        $validatedData = $request->validated();
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->storeAs('public/images/brands', $imageName);
            $validatedData['image'] = asset('storage/images/brands/' . $imageName);
        }
        $brand = Brand::create($validatedData);
        return response()->json($brand, 201);
    }

    public function show($id)
    {
        $brand = Brand::findOrFail($id);
        return response()->json($brand);
    }

    public function update(StoreBrandRequest $request, $id)
    {
        $brand = Brand::findOrFail($id);

        $validatedData = $request->validated();
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->storeAs('public/images/brands', $imageName);

            $validatedData['image'] = asset('storage/images/brands/' . $imageName);
        }
        $brand->update($validatedData);

        return response()->json($brand, 200);
    }

    public function destroy($id)
    {
        $brand = Brand::findOrFail($id);

        // Tìm và xóa tất cả các sản phẩm thuộc nhãn hàng này
        $products = \App\Models\Product::where('brand_id', $id)->get();
        foreach ($products as $product) {
            // Xóa các hình ảnh liên quan đến sản phẩm nếu có
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            // Xóa sản phẩm
            $product->delete();
        }

        // Xóa ảnh của nhãn hàng nếu có
        if ($brand->image) {
            Storage::disk('public')->delete($brand->image);
        }

        // Xóa nhãn hàng
        $brand->delete();

        return response()->json([
            'success' => true,
            'message' => 'Thương hiệu và tất cả các sản phẩm liên quan đã được xóa thành công.',
        ], 200);
    }


}
