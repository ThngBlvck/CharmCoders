<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateImagesTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('images', function (Blueprint $table) {
            $table->id(); // ID tự tăng
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            // Khóa ngoại liên kết với bảng `products`, xóa sản phẩm thì ảnh cũng bị xóa
            $table->string('image'); // Tên hoặc đường dẫn ảnh
            $table->timestamps(); // Thêm cột `created_at` và `updated_at`
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('images');
    }
}
