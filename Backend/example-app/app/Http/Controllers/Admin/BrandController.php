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
        $brands = Brand::all();
        return response()->json($brands);
    }

    public function store(StoreBrandRequest $request)
    {
        $validatedData = $request->validated();
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->storeAs('public/images/brands', $imageName);
            $validatedData['image'] = 'Backend/storage/images/brands/' . $imageName;
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

            $validatedData['image'] = 'Backend/storage/images/brands/' . $imageName;
        }

        $brand->update($validatedData);

        return response()->json($brand, 200);
    }


    public function destroy($id)
    {
        $brand = Brand::findOrFail($id);

        // Xóa ảnh liên kết nếu có
        if ($brand->image) {
            Storage::disk('public')->delete($brand->image);
        }

        // Xóa thương hiệu
        $brand->delete();

        return response()->json([
            'success' => true,
            'message' => 'Thương hiệu đã được xóa thành công.',
        ], 200);
    }
}
