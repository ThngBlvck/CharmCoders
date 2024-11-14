<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Blog_category;
use Illuminate\Http\Request;
use App\Http\Requests\Admin\StoreBlogCategoryRequest;

class BlogCategoryController extends Controller
{
    public function index()
    {
        $categories = Blog_category::all();
        return response()->json($categories);
    }
    public function show($id)
    {
        $category = Blog_category::find($id);
        return response()->json($category);
    }
    public function store(StoreBlogCategoryRequest $request)
    {
        $validatedData = $request->validated();
        $category = Blog_category::create($validatedData);
        return response()->json($category, 201);
    }
    public function update(StoreBlogCategoryRequest $request, $id)
    {
        $validatedData = $request->validated();
        $category = Blog_category::findOrFail($id);
        $category->update($validatedData);
        return response()->json($category);
    }
    public function destroy($id)
    {
        Blog_category::destroy($id);
        return response()->json([
            'success' => true,
            'message' => 'Danh mục đã được xóa thành công.',
        ], 200);
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

        // Tìm kiếm danh mục blog theo tên
        $categories = Blog_category::where('name', 'LIKE', "%{$query}%")->get();

        // Nếu không tìm thấy danh mục nào
        if ($categories->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy danh mục nào phù hợp.',
            ], 404);
        }

        // Trả về danh sách danh mục phù hợp
        return response()->json([
            'success' => true,
            'categories' => $categories,
        ], 200);
    }

}
