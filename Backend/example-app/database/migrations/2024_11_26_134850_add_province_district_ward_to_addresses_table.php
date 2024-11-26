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
        Schema::table('addresses', function (Blueprint $table) {
            $table->string('province')->after('address')->nullable(); // Thay 'column_name' bằng tên cột trước đó
            $table->string('district')->after('province')->nullable();
            $table->string('ward')->after('district')->nullable();
        });
    }
    
    public function down()
    {
        Schema::table('addresses', function (Blueprint $table) {
            $table->dropColumn(['province', 'district', 'ward']);
        });
    }
    
};
