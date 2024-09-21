<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Comment;
use App\Http\Requests\Admin\StoreCommentRequest;

class CommentController extends Controller
{
    public function index()
    {
        $comments = Comment::all();
        return response()->json($comments);
    }

    public function show($id)
    {
        $comment = Comment::find($id);
        return response()->json($comment);
    }

    public function store(StoreCommentRequest $request)
    {
        $validatedData = $request->validated();
        $comment = Comment::create($validatedData);
        return response()->json($comment, 201);
    }
    public function update(StoreCommentRequest $request, $id)
    {
        $validatedData = $request->validated();
        $comment = Comment::find($id);
        $comment->update($validatedData);
        return response()->json($comment);
    }
    public function destroy($id)
    {
        Comment::destroy($id);
        return response()->json([
            'success' => true,
            'message' => 'Xóa thành công.',
        ], 200);
    }
}
