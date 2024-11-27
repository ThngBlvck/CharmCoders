<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Banner;
use Illuminate\Support\Facades\Storage;

class BannerController extends Controller
{
    // Lấy tất cả banners
    public function index()
    {
        $banners = Banner::all()->map(function ($banner) {
            $banner->image_url = asset('storage/images/' . $banner->image_path);
            return $banner;
        });

        return response()->json($banners);
    }

    // Thêm nhiều ảnh
   public function store(Request $request)
   {
       $request->validate([
           'images' => 'required|array',
           'images.*' => 'image|mimes:jpeg,png,jpg,svg',  // Kiểm tra định dạng ảnh
       ]);

       // Đảm bảo thư mục `banners` tồn tại
       if (!Storage::disk('public')->exists('banners')) {
           Storage::disk('public')->makeDirectory('banners');
       }

       $imagePaths = [];
       foreach ($request->file('images') as $image) {
           // Kiểm tra nếu file hợp lệ
           if ($image->isValid()) {
               $path = $image->store('banners', 'public');
               $fullUrl = asset('storage/images/banners/' . $path); // Xây dựng URL đầy đủ

               // Lưu thông tin vào bảng Banner
               $imagePaths[] = Banner::create(['image_path' => $fullUrl]);
           }
       }

       return response()->json($imagePaths, 201);
   }


    // Lấy thông tin chi tiết banner theo ID
    public function show($id)
    {
        $banner = Banner::findOrFail($id);
        $banner->image_url = asset('storage/images/banners/' . $banner->image_path);
        return response()->json($banner);
    }

    // Cập nhật banner (sửa ảnh)
    public function update(Request $request, $id)
    {
        // Xác thực yêu cầu (bao gồm kiểm tra định dạng ảnh)
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,svg',  // Kiểm tra định dạng ảnh
            'status' => 'nullable|integer',  // Trạng thái là số và không bắt buộc
        ]);

        $banner = Banner::findOrFail($id);

        // Xóa ảnh cũ nếu tồn tại
        if (Storage::disk('public')->exists($banner->image_path)) {
            Storage::disk('public')->delete($banner->image_path);
        }

        // Đảm bảo thư mục `banners` tồn tại
        if (!Storage::disk('public')->exists('banners')) {
            Storage::disk('public')->makeDirectory('banners');
        }

        // Lưu ảnh mới
        $path = $request->file('image')->store('banners', 'public');
        $banner->image_path = $path;

        // Cập nhật trạng thái nếu có
        if ($request->has('status')) {
            $banner->status = $request->status;
        }

        // Lưu lại các thay đổi
        $banner->save();

        return response()->json($banner);
    }


    // Xóa banner
    public function destroy($id)
    {
        $banner = Banner::findOrFail($id);

        // Xóa ảnh trong storage nếu tồn tại
        if (Storage::disk('public')->exists($banner->image_path)) {
            Storage::disk('public')->delete($banner->image_path);
        }

        $banner->delete();

        return response()->json(['message' => 'Banner deleted successfully']);
    }
}
