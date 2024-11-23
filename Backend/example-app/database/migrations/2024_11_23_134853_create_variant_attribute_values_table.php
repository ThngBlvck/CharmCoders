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
        Schema::create('variant_attribute_values', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('variant_id'); // Liên kết với bảng variants
            $table->unsignedBigInteger('attribute_value_id'); // Liên kết đến bảng attribute_values
            $table->foreign('variant_id')->references('id')->on('variants')->onDelete('cascade'); // Khóa ngoại đến bảng variants
            $table->foreign('attribute_value_id')->references('id')->on('attribute_values')->onDelete('cascade'); // Khóa ngoại đến bảng attribute_values
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('variant_attribute_values');
    }
};
