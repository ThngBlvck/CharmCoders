<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreImageRequest;
use App\Models\Image;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

class ImageController extends Controller
{
    /**
     * Lấy danh sách hình ảnh
     */
    public function index()
    {
        $images = Image::all();
        return response()->json($images);
    }

    /**
     * Lấy thông tin hình ảnh theo ID
     */

    /**
     * Lưu trữ hình ảnh
     */
    public function store(Request $request)
    {
        $request->validate([
            'images' => 'required|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,svg',  // Kiểm tra định dạng ảnh
        ]);

        // Đảm bảo thư mục `products` tồn tại trong public
        if (!Storage::disk('public')->exists('images/products')) {
            Storage::disk('public')->makeDirectory('images/products');
        }

        $imagePaths = [];
        foreach ($request->file('images') as $image) {
            // Kiểm tra nếu file hợp lệ
            if ($image->isValid()) {
                // Lưu ảnh vào thư mục 'public/images/products'
                $path = $image->store('images/products', 'public');

                // Tạo đường dẫn URL cho ảnh
                $imageUrl = asset('storage/' . $path);

                // Lưu thông tin vào bảng Image
                $imagePaths[] = Image::create([
                    'product_id' => $request->input('product_id'),
                    'image' => $imageUrl, // Lưu URL thay vì đường dẫn file
                ]);
            }
        }

        return response()->json([
            'image_paths' => $imagePaths,
            'success' => true,
            'message' => 'Hình ảnh đã được tải lên thành công.'
        ], 201);
    }


    /**
     * Lấy thông tin hình ảnh theo ID
     *//**
     * Lấy thông tin hình ảnh theo ID
     */
    public function show($id)
    {
        // Tìm hình ảnh theo ID
        $image = Image::findOrFail($id);

        // Trả về thông tin hình ảnh
        return response()->json([
            'success' => true,
            'message' => 'Thông tin hình ảnh đã được lấy thành công.',
            'image' => $image
        ], 200);
    }

    /**
     * Cập nhật hình ảnh
     */
    public function update(StoreImageRequest $request, $id)
    {
        // Kiểm tra xem sản phẩm có ID $id có tồn tại không
        $image = Image::findOrFail($id);

        // Kiểm tra xem ID của sản phẩm có trùng với product_id trong request không
        $productId = $request->input('product_id');
        if ($image->product_id != $productId) {
            return response()->json([
                'success' => false,
                'message' => 'ID sản phẩm không khớp.'
            ], 400);
        }

        // Kiểm tra xem có ảnh mới được upload không
        if ($request->hasFile('images')) {
            // Lấy tất cả ảnh mới từ mảng images
            $newImages = $request->file('images');

            // Xóa ảnh cũ khỏi hệ thống tệp
            Storage::delete($image->image); // Sử dụng cột `image`

            $imagePaths = [];
            foreach ($newImages as $newImage) {
                // Lưu ảnh mới vào thư mục 'public/images/products'
                $path = $newImage->store('images/products', 'public');

                // Tạo URL cho ảnh mới
                $imageUrl = asset('storage/' . $path);

                // Cập nhật thông tin ảnh trong cơ sở dữ liệu
                $image->update([
                    'image' => $imageUrl,  // Lưu URL thay vì đường dẫn file
                ]);

                // Thêm URL vào mảng để trả về
                $imagePaths[] = $imageUrl;
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Hình ảnh đã được cập nhật thành công.',
            'image_paths' => $imagePaths  // Trả về URL của các ảnh đã được cập nhật
        ], 200);
    }


    /**
     * Xóa hình ảnh
     */
    public function destroy($id)
    {
        $image = Image::findOrFail($id);

        // Xóa ảnh khỏi hệ thống tệp
        Storage::delete($image->image); // Sử dụng cột `image`

        // Xóa record khỏi database
        $image->delete();

        return response()->json([
            'success' => true,
            'message' => 'Hình ảnh đã được xóa thành công.'
        ], 200);
    }
}
