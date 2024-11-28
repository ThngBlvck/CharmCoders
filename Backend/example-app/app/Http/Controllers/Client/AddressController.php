<?php

namespace App\Http\Controllers\client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Address;
use App\Http\Requests\Client\AddressRequest;

class AddressController extends Controller
{
    public function index()
    {
        $userId = auth()->id(); // Lấy ID người dùng hiện tại

        try {
            // Lấy tất cả các địa chỉ theo user_id
            $addresses = Address::where('user_id', $userId)->get();

            // Kiểm tra nếu không tìm thấy địa chỉ nào
            if ($addresses->isEmpty()) {
                return response()->json([
                    'error' => 'Người dùng này không có địa chỉ nào.'
                ], 404);
            }

            // Trả về dữ liệu dưới dạng JSON nếu tìm thấy địa chỉ
            return response()->json($addresses);
        } catch (\Illuminate\Database\QueryException $e) {
            // Bắt lỗi nếu bảng không tồn tại
            if ($e->getCode() == '42S02') {
                return response()->json([
                    'error' => 'Người dùng này không có địa chỉ nào.'
                ], 404);
            }

            // Xử lý các lỗi khác (nếu có)
            return response()->json([
                'error' => 'Đã xảy ra lỗi trong quá trình truy vấn dữ liệu.'
            ], 500);
        }
    }

    public function destroy($id)
    {
        $userId = auth()->id();

        $address = Address::where('id', $id)->where('user_id', $userId)->first();

        if (!$address) {
            return response()->json([
                'error' => 'Địa chỉ không tồn tại hoặc bạn không có quyền xóa.'
            ], 404);
        }

        $address->delete();

        return response()->json([
            'message' => 'Địa chỉ đã được xóa thành công.'
        ], 200);
    }


    public function show($id)
    {
        $userId = auth()->id(); // Lấy ID của người dùng hiện tại

        // Tìm địa chỉ theo ID và user_id
        $address = Address::where('id', $id)->where('user_id', $userId)->first();

        // Kiểm tra nếu địa chỉ không tồn tại hoặc không thuộc về người dùng
        if (!$address) {
            return response()->json([
                'error' => 'Địa chỉ không tồn tại hoặc bạn không có quyền truy cập.'
            ], 404);
        }

        // Trả về dữ liệu của địa chỉ
        return response()->json($address);
    }

    public function store(AddressRequest $request)
    {
        $userId = auth()->id();
        $address = new Address();
        $address->user_id = $userId;
        $address->address = $request->input('address');
        $address->province = $request->input('province');
        $address->district = $request->input('district');
        $address->ward = $request->input('ward');

        $address->save();

        return response()->json([
            'message' => 'Địa chỉ đã được tạo thành công.',
            'data' => $address,
        ], 201);
    }

    public function update($id, AddressRequest $request)
    {
        $userId = auth()->id();
        $address = Address::where('id', $id)->where('user_id', $userId)->first();

        if (!$address) {
            return response()->json([
                'error' => 'Địa chỉ không tồn tại hoặc bạn không có quyền sửa đổi.'
            ], 404);
        }

        $address->address = $request->input('address');
        $address->province = $request->input('province');
        $address->district = $request->input('district');
        $address->ward = $request->input('ward');

        $address->save();

        return response()->json([
            'message' => 'Địa chỉ đã được cập nhật thành công.',
            'data' => $address,
        ], 200);
    }
}
