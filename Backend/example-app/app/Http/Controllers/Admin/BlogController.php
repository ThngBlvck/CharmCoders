<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Blog;
use App\Http\Requests\Admin\StoreBlogRequest;
use Illuminate\Support\Facades\Storage;

class BlogController extends Controller
{
    public function index()
    {
        $blogs = Blog::leftJoin('blog_categories', 'blogs.category_id', '=', 'blog_categories.id')
            ->select('blogs.*', 'blog_categories.name as category_name')
            ->get();
        $blogs->transform(function ($blog) {
            $blog->category_name = $blog->category_name ?? 'Chưa phân loại';
            return $blog;
        });

        return response()->json($blogs);
    }
    public function show($id)
    {
        $blog = Blog::find($id);
        return response()->json($blog);
    }
    public function store(StoreBlogRequest $request)
    {
        $validatedData = $request->validated();
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->storeAs('public/images/blogs', $imageName);
            $validatedData['image'] = asset('storage/images/blogs/' . $imageName);
        }
        $blog = Blog::create($validatedData);
        return response()->json($blog, 201);
    }

    public function destroy($id)
    {
        $blog = Blog::find($id);
        $blog->delete();
        return response()->json([
            'success' => true,
            'message' => 'Bài viết đã được xóa thành công.',
        ], 200);
    }

    public function update(StoreBlogRequest $request, $id)
    {
        $validatedData = $request->validated();
        $blog = Blog::find($id);
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->storeAs('public/images/blogs', $imageName);
            $validatedData['image'] = asset('storage/images/blogs/' . $imageName);
        } else {
            $validatedData['image'] = $blog->image;
        }

        $blog->update($validatedData);
        return response()->json($blog, 201);
    }

    public function search(Request $request)
    {
        // Lấy từ khóa tìm kiếm từ request
        $query = $request->input('query');

        // Nếu không có từ khóa tìm kiếm, trả về lỗi
        if (!$query) {
            return response()->json([
                'success' => false,
                'message' => 'Vui lòng cung cấp từ khóa tìm kiếm.',
            ], 400);
        }

        // Tìm kiếm bài viết theo tiêu đề
        $blogs = Blog::where('title', 'LIKE', "%{$query}%")->get();

        // Nếu không tìm thấy bài viết nào
        if ($blogs->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy bài viết nào phù hợp.',
            ], 404);
        }

        // Trả về danh sách bài viết phù hợp
        return response()->json([
            'success' => true,
            'blogs' => $blogs,
        ], 200);
    }


    public function upload(Request $request)
    {
        // Kiểm tra nếu yêu cầu có file 'upload'
        if ($request->hasFile('upload')) {
            try {
                $file = $request->file('upload');

                // Kiểm tra loại file nếu cần (chỉ cho phép ảnh)
                $validExtensions = ['jpg', 'jpeg', 'png'];
                if (!in_array($file->getClientOriginalExtension(), $validExtensions)) {
                    return response()->json(['error' => 'Invalid file type'], 400);
                }

                // Lưu file vào thư mục 'uploads'
                $path = $file->store('uploads', 'public'); // Lưu vào thư mục public

                // Tạo URL truy cập file
                $url = asset('storage/' . $path);

                return response()->json([
                    'url' => $url,
                ], 200);

            } catch (\Exception $e) {
                return response()->json([
                    'error' => 'File upload failed: ' . $e->getMessage()
                ], 500);
            }
        }

        return response()->json(['error' => 'No file provided'], 400);
    }

}
