<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\Product;
use App\Http\Requests\Admin\StoreCartRequest;
use Illuminate\Support\Facades\Log;
use Exception;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function index()
    {
        $carts = Cart::all();
        return response()->json($carts);
    }

    public function store(StoreCartRequest $request)
    {
        $userId = auth()->id();
        if (!$userId) {
            return response()->json(['error' => 'Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.'], 401);
        }

        // Lấy product_id và số lượng từ request
        $productId = $request->input('product_id');
        $quantity = $request->input('quantity', 1); // Mặc định số lượng là 1 nếu không được cung cấp

        if (!$productId) {
            return response()->json(['error' => 'Bạn cần cung cấp product_id!'], 400);
        }

        // Lấy thông tin sản phẩm
        $product = Product::find($productId);
        if (!$product) {
            return response()->json(['error' => 'Sản phẩm không tồn tại!'], 404);
        }

        // Kiểm tra số lượng có hợp lệ hay không
        if ($quantity < 1) {
            return response()->json(['error' => 'Số lượng phải lớn hơn hoặc bằng 1!'], 400);
        }

        // Tính giá trị cho giỏ hàng dựa trên giá sản phẩm
        $price = $product->getPrice(); // Gọi phương thức getPrice để lấy giá
        $totalAmount = $price * $quantity; // Tính tổng số tiền

        // Kiểm tra xem sản phẩm đã có trong giỏ hàng hay chưa
        $cartItem = Cart::where('user_id', $userId)->where('product_id', $productId)->first();

        if ($cartItem) {
            // Nếu sản phẩm đã tồn tại trong giỏ hàng, tăng số lượng
            $cartItem->quantity += $quantity; // Tăng số lượng
            $cartItem->total_amount += $totalAmount; // Cập nhật tổng tiền
            $cartItem->save(); // Lưu lại
        } else {
            // Nếu sản phẩm chưa tồn tại, tạo mới bản ghi
            Cart::create([
                'user_id' => $userId,
                'product_id' => $productId,
                'quantity' => $quantity,
                'price' => $price, // Lưu giá vào cột price của bảng cart
                'total_amount' => $totalAmount, // Lưu tổng tiền vào cột total_amount
            ]);
        }

        return response()->json(['success' => 'Sản phẩm đã được thêm vào giỏ hàng.'], 200);
    }

    public function show($id)
    {
        try {
            $cart = Cart::findOrFail($id); // Tìm giỏ hàng theo ID
            return response()->json($cart, 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy giỏ hàng.',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    public function update(StoreCartRequest $request, $id)
    {
        try {
            // Tìm giỏ hàng theo ID
            $cart = Cart::findOrFail($id);
            $validatedData = $request->validated();

            // Lấy giá sản phẩm từ cơ sở dữ liệu
            $product = Product::find($cart->product_id);
            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sản phẩm không tồn tại.'
                ], 404);
            }

            // Tính tổng giá dựa trên số lượng mới
            $price = $product->getPrice(); // Giả sử bạn có hàm getPrice() để lấy giá sản phẩm
            $quantity = $validatedData['quantity'];
            $totalAmount = $price * $quantity;

            // Cập nhật các giá trị vào dữ liệu đã được xác thực
            $validatedData['price'] = $price; // Cập nhật giá sản phẩm vào giỏ hàng
            $validatedData['total_amount'] = $totalAmount;

            // Cập nhật giỏ hàng với số lượng và tổng giá mới
            $cart->update($validatedData);

            return response()->json([
                'success' => true,
                'message' => 'Giỏ hàng đã được cập nhật thành công.',
                'data' => $cart
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Đã xảy ra lỗi khi cập nhật giỏ hàng.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }



    public function destroy($id)
    {
        try {
            $cart = Cart::findOrFail($id); // Tìm giỏ hàng theo ID
            $cart->delete(); // Xóa giỏ hàng

            return response()->json([
                'success' => true,
                'message' => 'Sản phẩm đã được xóa khỏi giỏ hàng thành công.'
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Đã xảy ra lỗi khi xóa sản phẩm.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
