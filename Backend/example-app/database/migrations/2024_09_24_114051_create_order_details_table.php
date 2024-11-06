<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrderDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('order_detail', function (Blueprint $table) {
            $table->id();
            $table->double('price', 10, 2)->nullable();
            $table->integer('quantity')->nullable();
            $table->double('discount', 10, 2)->nullable();
            $table->timestamps();
            $table->unsignedBigInteger('order_id')->nullable();

            // Foreign key constraint nếu có bảng orders
            $table->foreign('order_id')->references('id')->on('orders')->onDelete('set null');
            $table->foreignId('product_id')->constrained('products')->after('order_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('order_detail');
    }
}
