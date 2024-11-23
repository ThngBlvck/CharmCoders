<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsTable extends Migration
{
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255)->nullable();
            $table->double('unit_price', 10, 2)->nullable();
            $table->double('sale_price', 10, 2)->nullable();
            $table->integer('quantity')->nullable();
            $table->text('image')->nullable();
            $table->text('content')->nullable();
            $table->integer('views')->nullable();
            $table->tinyInteger('status')->default(1);
            $table->unsignedBigInteger('brand_id')->nullable(); // Thêm cột brand_id
            $table->unsignedBigInteger('category_id')->nullable(); // Thêm cột category_id

            // Thêm cột cho thông tin biến thể (có thể nullable)
            $table->string('sku')->nullable()->unique();  // SKU của sản phẩm
            $table->decimal('price', 10, 2)->nullable();   // Giá của sản phẩm
            $table->integer('quantity')->nullable()->default(0);  // Số lượng của sản phẩm

            $table->timestamps();

            // Thiết lập khóa ngoại cho cột brand_id
            $table->foreign('brand_id')
                ->references('id')->on('brands')
                ->onDelete('set null');

            // Thiết lập khóa ngoại cho cột category_id
            $table->foreign('category_id')
                ->references('id')->on('categories')
                ->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::dropIfExists('products');
    }
}
