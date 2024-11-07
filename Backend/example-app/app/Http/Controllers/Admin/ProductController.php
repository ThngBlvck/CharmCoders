<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Http\Requests\Admin\StoreProductRequest;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;


class ProductController extends Controller
{
    // Hiển thị danh sách sản phẩm
    public function index()
    {
        $products = Product::leftJoin('categories', 'products.category_id', '=', 'categories.id')
            ->select('products.*', 'categories.name as category_name')
            ->get();

        $products->transform(function ($product) {
            $product->category_name = $product->category_name ?? 'Chưa phân loại';
            return $product;
        });

        return response()->json($products);
    }



    // Tạo sản phẩm mới
    public function store(StoreProductRequest $request)
    {
        $validatedData = $request->validated();


        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->storeAs('public/images/products', $imageName);
            $validatedData['image'] = asset('storage/images/products/' . $imageName);
        }

        $product = Product::create($validatedData);
        return response()->json($product, 201);
    }

    // Hiển thị chi tiết sản phẩm
    public function show($id)
    {
        $product = Product::findOrFail($id);
        $product->views = $product->views + 1;
        $product->save();
        return response()->json($product);
    }

    // Cập nhật sản phẩm
    public function update(StoreProductRequest $request, $id)
    {
        $product = Product::findOrFail($id);

        $validatedData = $request->validated();

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->storeAs('public/images/products', $imageName);
            $validatedData['image'] = asset('storage/images/products/' . $imageName);
        }

        $product->update($validatedData);
        return response()->json($product, 200);
    }

    // Xóa sản phẩm
    public function destroy($id)
    {
        $product = Product::find($id);

        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Sản phẩm đã được xóa thành công.',
        ], 200);
    }



    // Chức năng tìm kiếm sản phẩm
    public function search(Request $request)
    {
        // Lấy từ khóa tìm kiếm từ request
        $query = $request->input('query');
        $perPage = 10; // số lượng sản phẩm mỗi trang
        $currentPage = $request->input('page', 1); // số trang hiện tại, mặc định là 1

        // Nếu không có từ khóa tìm kiếm, hiển thị tất cả sản phẩm
        if (!$query) {
            $products = Product::paginate($perPage);
        } else {
            // Tìm kiếm sản phẩm theo tên, nội dung hoặc các thuộc tính khác
            $products = Product::where('name', 'LIKE', "%{$query}%")
                ->orWhere('content', 'LIKE', "%{$query}%")
                ->orWhere('unit_price', 'LIKE', "%{$query}%")
                ->paginate($perPage); // Phân trang cho kết quả tìm kiếm
        }

        // Biến đổi kết quả để gán 'Chưa phân loại' nếu không có category_name
        $products->getCollection()->transform(function ($product) {
            $product->category_name = $product->category_name ?? 'Chưa phân loại';
            return $product;
        });
        // Trả về danh sách sản phẩm phù hợp hoặc tất cả sản phẩm
        return response()->json([
            'success' => true,
            'products' => $products,
        ], 200);
    }

}
