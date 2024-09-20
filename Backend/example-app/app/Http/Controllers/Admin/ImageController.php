<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreImageRequest;
use App\Models\Image;
use Illuminate\Support\Facades\Storage;
use Request;

class ImageController extends Controller
{
    /**
     * Lưu trữ các hình ảnh được tải lên
     */

    public function index()
    {
        $image = Image::all();
        return response()->json($image);
    }

    public function store(StoreImageRequest $request)
    {
        // Lấy product_id từ request
        $productId = $request->input('product_id');

        // Kiểm tra xem có ảnh được upload không
        if ($request->hasFile('images')) {
            $images = $request->file('images'); // Lấy mảng ảnh

            foreach ($images as $image) {
                // Lưu từng ảnh vào thư mục 'public/images/products'
                $path = $image->store('public/images/products');

                // Lưu thông tin ảnh vào database (bảng images)
                Image::create([
                    'product_id' => $productId,  // Liên kết với product_id
                    'name' => $path,  // Đường dẫn ảnh
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Hình ảnh đã được tải lên thành công.'
        ], 200);
    }


    public function show($id)
    {
        $image = Image::findOrFail($id);
        return response()->json($image);
    }

    public function update(StoreImageRequest $request, $id)
    {
        // Tìm hình ảnh theo ID
        $image = Image::findOrFail($id);

        // Kiểm tra xem có ảnh mới được upload không
        if ($request->hasFile('images')) {
            // Lấy tất cả ảnh mới từ mảng images
            $newImages = $request->file('images');

            // Xóa ảnh cũ khỏi hệ thống tệp
            Storage::delete($image->name);

            // Cập nhật thông tin ảnh trong cơ sở dữ liệu
            foreach ($newImages as $newImage) {
                // Lưu ảnh mới vào thư mục 'public/images/products'
                $path = $newImage->store('public/images/products');

                // Cập nhật thông tin ảnh trong cơ sở dữ liệu
                $image->update([
                    'name' => $path,  // Đường dẫn ảnh mới
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Hình ảnh đã được cập nhật thành công.'
        ], 200);
    }

    /**
     * Xóa hình ảnh
     */
    public function destroy($id)
    {
        $image = Image::findOrFail($id);

        // Xóa ảnh khỏi hệ thống tệp
        Storage::delete($image->name);

        // Xóa record khỏi database
        $image->delete();

        return response()->json([
            'success' => true,
            'message' => 'Hình ảnh đã được xóa thành công.'
        ], 200);
    }

}
