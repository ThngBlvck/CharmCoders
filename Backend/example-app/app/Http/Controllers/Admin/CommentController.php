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
           // Giả sử bảng comments có khóa ngoại product_id và user_id để liên kết với bảng products và users
           $comments = Comment::join('products', 'comments.product_id', '=', 'products.id')
               ->join('users', 'comments.user_id', '=', 'users.id')
               ->select('comments.*', 'products.name as product_name', 'users.name as user_name')
               ->get();

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

        // Gán user_id bằng ID của người dùng đang đăng nhập
        $validatedData['user_id'] = auth()->id();

        $comment = Comment::create($validatedData);
        return response()->json($comment, 201);
    }

    public function update(StoreCommentRequest $request, $id)
    {
        $validatedData = $request->validated();
        $comment = Comment::find($id);

        // Kiểm tra xem người dùng có quyền cập nhật bình luận không
        if ($comment->user_id !== auth()->id()) {
            return response()->json([
                'error' => 'Bạn không có quyền sửa bình luận này.'
            ], 403); // 403 Forbidden
        }

        $comment->update($validatedData);
        return response()->json($comment);
    }

    public function destroy($id)
    {
        $comment = Comment::find($id);

        // Kiểm tra xem người dùng có quyền xóa bình luận không
        if ($comment->user_id !== auth()->id()) {
            return response()->json([
                'error' => 'Bạn không có quyền xóa bình luận này.'
            ], 403); // 403 Forbidden
        }

        Comment::destroy($id);
        return response()->json([
            'success' => true,
            'message' => 'Xóa thành công.',
        ], 200);
    }

public function getCommentsByProductId($productId)
{
    // Retrieve comments associated with the given product ID
    $comments = Comment::where('product_id', $productId)
                ->join('users', 'comments.user_id', '=', 'users.id')
                ->select('comments.*', 'users.name as user_name')
                ->get();

    return response()->json($comments);
}

}
