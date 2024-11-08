<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\Client\UpdateUserProfileRequest;
use Illuminate\Support\Facades\Hash;

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

    public function profile(UpdateUserProfileRequest $request, $id)
    {
        $user = User::findOrFail($id);
        $validatedData = $request->validated();
       
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time(). '_'. $image->getClientOriginalName();
            $image->storeAs('public/images/users', $imageName);
            $validatedData['image'] = asset('storage/images/users/'. $imageName);
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
            'role' => $request->user()->role_id, // Nếu có
        ]);
    }
}
