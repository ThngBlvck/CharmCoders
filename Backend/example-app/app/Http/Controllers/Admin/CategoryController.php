<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Http\Requests\Admin\StoreCategoryRequest;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::all();
        return response()->json($categories);
    }

    public function store(StoreCategoryRequest $request)
    {
        $validatedData = $request->validated();
        // Sử dụng dữ liệu đã xác thực
        $category = Category::create($validatedData);
        return response()->json($category, 201);
    }

    public function show($id)
    {
        $category = Category::findOrFail($id);
        return response()->json($category);
    }

    public function update(StoreCategoryRequest $request, $id)
    {
        $validatedData = $request->validated();
        $category = Category::findOrFail($id);
        $category->update($validatedData);
        return response()->json($category);
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();
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

        // Tìm kiếm danh mục theo tên hoặc mô tả
        $categories = Category::where('name', 'LIKE', "%{$query}%")->get();

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
