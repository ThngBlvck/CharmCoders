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
        // Tìm đối tượng thương hiệu dựa trên ID
        $brand = Brand::findOrFail($id);

        // Lấy dữ liệu đã xác thực
        $validatedData = $request->validated();

        // Kiểm tra xem có hình ảnh mới được tải lên không
        if ($request->hasFile('image')) {
            // Lưu hình ảnh mới
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->storeAs('public/images/brands', $imageName);

            // Cập nhật đường dẫn hình ảnh vào mảng dữ liệu
            $validatedData['image'] = 'Backend/storage/images/brands/' . $imageName;
        }

        // Cập nhật dữ liệu cho thương hiệu, bao gồm hình ảnh mới nếu có
        $brand->update($validatedData);

        // Trả về phản hồi JSON với mã trạng thái 200
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
