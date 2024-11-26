<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Thực hiện thay đổi trên bảng comments.
     */
    public function up(): void
    {
        Schema::table('comments', function (Blueprint $table) {
            // Xóa khóa ngoại nếu tồn tại
            $table->dropForeign(['product_id']);

            // Xóa cột product_id
            if (Schema::hasColumn('comments', 'product_id')) {
                $table->dropColumn('product_id');
            }

            // Thêm cột blog_id
            $table->unsignedBigInteger('blog_id')->after('user_id');

            // Tạo khóa ngoại blog_id
            $table->foreign('blog_id')->references('id')->on('blogs')->onDelete('cascade');
        });
    }

    /**
     * Hoàn tác thay đổi.
     */
    public function down(): void
    {
        Schema::table('comments', function (Blueprint $table) {
            // Xóa khóa ngoại và cột blog_id
            if (Schema::hasColumn('comments', 'blog_id')) {
                $table->dropForeign(['blog_id']);
                $table->dropColumn('blog_id');
            }

            // Thêm lại cột product_id
            $table->unsignedBigInteger('product_id')->nullable();

            // Tạo lại khóa ngoại cho product_id
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });
    }
};
