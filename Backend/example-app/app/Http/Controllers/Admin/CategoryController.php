<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
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
}
