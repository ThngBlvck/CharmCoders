<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('variants', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id'); // Liên kết đến sản phẩm
            $table->string('sku')->default('SKU-' . strtoupper(Str::random(8)));  // Mã SKU, duy nhất cho mỗi biến thể
            $table->decimal('price', 10, 2)->nullable(); // Giá riêng của biến thể
            $table->integer('quantity')->default(0); // Số lượng riêng của biến thể
            $table->timestamps();

            // Khóa ngoại liên kết với bảng products
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('variants');
    }
};
