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
        // Sử dụng dữ liệu đã xác thực
        $category = Category::create($request->validated());
        return response()->json($category, 201);
    }

    public function show($id)
    {
        $category = Category::findOrFail($id);
        return response()->json($category);
    }

    public function update(StoreCategoryRequest $request, $id)
    {
        $category = Category::findOrFail($id);

        // Sử dụng dữ liệu đã xác thực
        $category->update($request->validated());
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
}
