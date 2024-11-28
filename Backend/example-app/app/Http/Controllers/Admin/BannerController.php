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

      // Đảm bảo thư mục `images/banners` tồn tại
      if (!Storage::disk('public')->exists('images/banners')) {
          Storage::disk('public')->makeDirectory('images/banners');
      }

      $imagePaths = [];
      foreach ($request->file('images') as $image) {
          // Kiểm tra nếu file hợp lệ
          if ($image->isValid()) {
              // Lưu file vào thư mục `images/banners`
              $path = $image->store('images/banners', 'public');
              $fullUrl = asset('storage/' . $path); // Xây dựng URL đầy đủ

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
        // Xác thực yêu cầu (chỉ kiểm tra trạng thái)
        $request->validate([
            'status' => 'required|integer', // Trạng thái là số và bắt buộc
        ]);

        // Tìm banner theo ID
        $banner = Banner::findOrFail($id);

        // Cập nhật trạng thái
        $banner->status = $request->status;

        // Lưu lại thay đổi
        $banner->save();

        return response()->json($banner, 200);
    }



    // Xóa banner
    public function destroy($id)
    {
        $banner = Banner::findOrFail($id);

        // Đường dẫn lưu ảnh từ `storage/images/banners/`
        $imagePath = 'images/banners/' . basename($banner->image_path);

        // Xóa ảnh trong storage nếu tồn tại
        if (Storage::disk('public')->exists($imagePath)) {
            Storage::disk('public')->delete($imagePath);
        }

        // Xóa bản ghi trong cơ sở dữ liệu
        $banner->delete();

        return response()->json(['message' => 'Banner deleted successfully'], 200);
    }

}
