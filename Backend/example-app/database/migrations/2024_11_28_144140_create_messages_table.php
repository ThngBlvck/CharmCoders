<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sender_id')->constrained('users')->onDelete('cascade'); // Người gửi
            $table->foreignId('receiver_id')->constrained('users')->onDelete('cascade'); // Người nhận
            $table->text('message');
            $table->timestamps();
        });
    }
    
    public function down()
    {
        Schema::dropIfExists('messages');
    }
    
};
