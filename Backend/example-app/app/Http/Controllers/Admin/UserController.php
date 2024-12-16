<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\Client\UpdateUserProfileRequest;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\Client\ChangePasswordRequest;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{

    public function index()
    {
        $users = User::whereIn('role_id', [1, 3])->get();
        return response()->json($users);
    }

    public function store(StoreUserRequest $request)
    {
        $validatedData = $request->validated();
        $validatedData['password'] = Hash::make($request->password);
        $validatedData['role_id'] = 3;
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->storeAs('public/images/employees', $imageName);
            $validatedData['image'] = asset('storage/images/employees/' . $imageName);
        }
        $user = User::create($validatedData);
        return response()->json($user);
    }

    public function show($id)
    {
        $user = User::where('id', $id)->where('role_id', 3)->first();


        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy nhân viên.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'user' => $user
        ]);
    }


    public function destroy($id)
    {

        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'Người dùng không tồn tại'], 404);
        }

        if ($user->role_id != 3) {
            return response()->json(['error' => 'Không thể xóa người dùng này, chỉ có thể xóa nhân viên'], 403);
        }
        $user->delete();
        return response()->json(['message' => 'Người dùng đã được xóa thành công'], 200);
    }

    public function update(StoreUserRequest $request, $id)
    {

        $user = User::findOrFail($id);
        $validatedData = $request->validated();
        if ($request->filled('password')) {
            $validatedData['password'] = Hash::make($request->password);
        } else {
            unset($validatedData['password']);
        }
        $validatedData['role_id'] = $user->role_id;

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->storeAs('public/images/employees', $imageName);
            $validatedData['image'] = asset('storage/images/employees/' . $imageName);
        } else {
            $validatedData['image'] = $user->image;
        }

        $user->update($validatedData);

        return response()->json($user);
    }

    public function profile(UpdateUserProfileRequest $request)
    {
        $id = auth()->id();
        $user = User::findOrFail($id);
        $validatedData = $request->validated();

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->storeAs('public/images/users', $imageName);
            $validatedData['image'] = asset('storage/images/users/' . $imageName);
        } else {
            $validatedData['image'] = $user->image;
        }

        $user->update($validatedData);

        return response()->json($user);

    }

    public function getUser(Request $request)
    {
        return response()->json([
            'user_id' => $request->user()->id,
            'name' => $request->user()->name,
            'email' => $request->user()->email,
            'address' => $request->user()->address, // Nếu có
            'phone' => $request->user()->phone,
            'image' => $request->user()->image,
            'role' => $request->user()->role_id, // Nếu có
        ]);
    }

    public function changePassword(ChangePasswordRequest $request)
    {
        $user = Auth::user();

        // Nếu người dùng có tài khoản xã hội, không cho phép đổi mật khẩu
        if ($user->auth_provider !== null) {
            return response()->json([
                'error' => 'Không thể thay đổi mật khẩu cho tài khoản đăng nhập qua mạng xã hội.',
                'message' => 'Không thể thay đổi mật khẩu cho tài khoản đăng nhập qua mạng xã hội'
            ], 400);
        }

        // Kiểm tra mật khẩu hiện tại
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'error' => 'Mật khẩu hiện tại không chính xác.',
                'message' => 'Mật khẩu hiện tại không chính xác.'
            ], 400);
        }

        // Cập nhật mật khẩu mới
        $user->password = bcrypt($request->password);
        $user->save();

        return response()->json([
            'message' => 'Mật khẩu đã được thay đổi thành công.',
        ], 200);
    }


    public function deleteUser()
    {
        // Lấy ID của người dùng hiện tại
        $userId = auth()->id();

        // Tìm người dùng theo ID
        $user = User::find($userId);

        // Kiểm tra nếu người dùng không tồn tại
        if (!$user) {
            return response()->json(['error' => 'Người dùng không tồn tại'], 404);
        }

        // Kiểm tra nếu người dùng không phải là nhân viên (role_id = 3)
        if ($user->role_id != 1) {
            return response()->json(['error' => 'Chỉ có thể hủy tài khoản user'], 403);
        }

        // Kiểm tra đơn hàng của người dùng
        $hasInvalidOrders = $user->orders()->whereNotIn('status', [3, 4])->exists();

        if ($hasInvalidOrders) {
            return response()->json(['error' => 'Không thể xóa người dùng vì họ có đơn hàng không hợp lệ'], 403);
        }

        // Thực hiện xóa người dùng
        $user->delete();

        return response()->json(['message' => 'Người dùng đã được xóa thành công'], 200);
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

        // Tìm kiếm sản phẩm theo tên, nội dung hoặc các thuộc tính khác
        $users = User::where('name', 'LIKE', "%{$query}%")->get();

        // Nếu không tìm thấy sản phẩm
        if ($users->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy sản phẩm nào phù hợp.',
            ], 404);
        }

        // Trả về danh sách sản phẩm phù hợp
        return response()->json([
            'success' => true,
            'users' => $users,
        ], 200);
    }
}
