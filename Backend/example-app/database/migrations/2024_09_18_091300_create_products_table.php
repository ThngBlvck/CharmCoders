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
            $table->timestamps();
            $table->foreignId('brand_id')->nullable()->constrained('brands')->onDelete('set null');
            $table->foreignId('category_id')->nullable()->constrained('categories')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::dropIfExists('products');
    }
}
