<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Cart;
use App\Http\Requests\Admin\StoreCartRequest;
use Illuminate\Support\Facades\Log;
use Exception;

class CartController extends Controller
{
    public function index()
    {
        $carts = Cart::all();
        return response()->json($carts);
    }


    public function store(StoreCartRequest $request)
    {
        try {
            // Ghi log để kiểm tra dữ liệu trước khi xác thực
            Log::info('Request data:', $request->all());

            // Lấy dữ liệu đã được xác thực
            $validatedData = $request->validated();

            // Ghi log để kiểm tra dữ liệu sau khi xác thực
            Log::info('Validated data:', $validatedData);

            // Tính tổng tiền
            $totalAmount = $validatedData['price'] * $validatedData['quantity'];

            // Gộp dữ liệu đã xác thực với 'total_amount'
            $dataToInsert = array_merge($validatedData, ['total_amount' => $totalAmount]);

            // Ghi log để kiểm tra dữ liệu trước khi lưu
            Log::info('Data to insert:', $dataToInsert);

            // Lưu bản ghi vào cơ sở dữ liệu
            $cart = Cart::create($dataToInsert);

            // Trả về phản hồi thành công
            return response()->json(['success' => true, 'cart' => $cart], 201);

        } catch (Exception $e) {
            // Bắt các lỗi khác không phải lỗi xác thực
            Log::error('Error occurred:', ['error' => $e->getMessage()]);

            return response()->json([
                'success' => false,
                'message' => 'Đã xảy ra lỗi trong quá trình xử lý.',
                'error' => $e->getMessage(),
            ], 500);
        }
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
            $cart = Cart::findOrFail($id); // Tìm giỏ hàng theo ID
            $validatedData = $request->validated();

            // Tính toán hoặc cập nhật các trường khác
            $totalAmount = $validatedData['price'] * $validatedData['quantity'];
            $validatedData['total_amount'] = $totalAmount;

            // Cập nhật giỏ hàng
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
