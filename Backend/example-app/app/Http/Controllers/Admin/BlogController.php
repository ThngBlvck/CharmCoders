<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Blog;
use App\Http\Requests\Admin\StoreBlogRequest;

class BlogController extends Controller
{
    public function index()
    {
        $blogs = Blog::all();
        return response()->json($blogs);
    }
    public function show($id)
    {
        $blog = Blog::find($id);
        return response()->json($blog);
    }
    public function store(StoreBlogRequest $request)
    {
        $validatedData = $request->validated();
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->storeAs('public/images/blogs', $imageName);
            $validatedData['image'] = 'storage/images/blogs/' . $imageName;
        }
        $blog = Blog::create($validatedData);
        return response()->json($blog, 201);
    }

    public function destroy($id)
    {
        $blog = Blog::find($id);
        $blog->delete();
        return response()->json([
            'success' => true,
            'message' => 'Bài viết đã được xóa thành công.',
        ], 200);
    }

    public function update(StoreBlogRequest $request, $id)
    {
        $validatedData = $request->validated();
        $blog = Blog::find($id);
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->storeAs('public/images/blogs', $imageName);
            $validatedData['image'] = 'storage/images/blogs/' . $imageName;
        } else {
            $validatedData['image'] = $blog->image;
        }

        $blog->update($validatedData);
        return response()->json($blog, 201);
    }
}
