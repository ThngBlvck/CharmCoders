<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Role;
use App\Http\Requests\Admin\StoreRoleRequest;


class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::all();
        return response()->json($roles);
    }

    public function show($id)
    {
        $role = Role::find($id);
        return response()->json($role);
    }

    public function store(storeRoleRequest $request)
    {
        $validatedData = $request->validated();
        $role = Role::create($validatedData);
        return response()->json($role, 201);
    }

    public function Update(StoreRoleRequest $request, $id)
    {
        $validatedData = $request->validated();
        $role = Role::find($id);
        $role->update($validatedData);
        return response()->json($role);
    }

    public function destroy($id)
    {
        Role::destroy($id);
        return response()->json([
            'success' => true,
            'message' => ' Xóa thành công.',
        ], 200);
    }
}
