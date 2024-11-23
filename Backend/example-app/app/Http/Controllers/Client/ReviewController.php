<?php

namespace App\Http\Controllers\client;

use App\Http\Controllers\Controller;
use App\Http\Requests\Client\StoreReviewRequest;
use App\Http\Requests\UpdateReviewRequest;
use App\Models\Review;
use App\Models\Order_detail;

class ReviewController extends Controller
{
    /**
     * Lưu đánh giá mới.
     */
    public function store(StoreReviewRequest $request)
    {
        // Kiểm tra xem người dùng đã đánh giá sản phẩm này chưa
        $existingReview = Review::where('user_id', auth()->id())
            ->where('product_id', $request->product_id)
            ->first();

        if ($existingReview) {
            return response()->json(['message' => 'Bạn đã đánh giá sản phẩm này rồi.'], 403);
        }

        // Kiểm tra xem sản phẩm đã được mua hay chưa
        $hasPurchased = Order_detail::whereHas('order', function ($query) {
            $query->where('user_id', auth()->id())
                ->where('status', 3); // Hóa đơn đã nhận hàng
        })->where('product_id', $request->product_id)->exists();

        if (!$hasPurchased) {
            return response()->json(['message' => 'Bạn chưa mua sản phẩm này hoặc hóa đơn chưa hoàn tất.'], 403);
        }

        // Tạo đánh giá
        $review = Review::create([
            'user_id' => auth()->id(),
            'product_id' => $request->product_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return response()->json(['message' => 'Đánh giá thành công.', 'review' => $review], 201);
    }

    /**
     * Chỉnh sửa đánh giá.
     */
    public function update(StoreReviewRequest $request, $id)
    {

        $review = Review::where('id', $id)->where('user_id', auth()->id())->first();

        if (!$review) {
            return response()->json(['message' => 'Đánh giá không tồn tại hoặc bạn không có quyền chỉnh sửa.'], 403);
        }

        // Cập nhật đánh giá
        $review->update($request->validated());

        return response()->json(['message' => 'Cập nhật đánh giá thành công.', 'review' => $review], 200);
    }
}
