<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // Chức năng tìm kiếm sản phẩm
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

        // Tìm kiếm sản phẩm theo tên, nội dung hoặc các thuộc tính khác
        $products = Product::where('name', 'LIKE', "%{$query}%")
            ->orWhere('content', 'LIKE', "%{$query}%")
            ->orWhere('unit_price', 'LIKE', "%{$query}%")
            ->get();

        // Nếu không tìm thấy sản phẩm
        if ($products->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy sản phẩm nào phù hợp.',
            ], 404);
        }

        // Trả về danh sách sản phẩm phù hợp
        return response()->json([
            'success' => true,
            'products' => $products,
        ], 200);
    }

    public function getRelatedProducts($id)
    {
        // Lấy sản phẩm theo id
        $product = Product::findOrFail($id);

        // Lấy các sản phẩm cùng danh mục và cùng thương hiệu, loại trừ sản phẩm hiện tại
        $relatedProducts = Product::where(function($query) use ($product) {
            $query->where('category_id', $product->category_id)  // Cùng danh mục
                  ->orWhere('brand_id', $product->brand_id);      // Hoặc cùng nhãn hàng
        })
        ->where('id', '!=', $product->id)  // Loại trừ sản phẩm hiện tại
        ->get(['id', 'name', 'image', 'unit_price', 'sale_price']);


        // Trả về JSON
        return response()->json([
            'product' => $product,  // Trả về sản phẩm chi tiết
            'related_products' => $relatedProducts,  // Trả về các sản phẩm liên quan
        ]);
    }

    public function getHotProducts()
    {
        $hotProducts = Product::select('id', 'name', 'sale_price', 'unit_price', 'image')  // Chỉ chọn các cột 'name', 'sale_price', và 'image'
            ->orderBy('purchase_count', 'desc')  // Sắp xếp theo số lượt mua giảm dần
            ->take(5)  // Lấy 10 sản phẩm hot nhất
            ->get();

        return response()->json([
            'hot_products' => $hotProducts,
        ]);
    }



}
