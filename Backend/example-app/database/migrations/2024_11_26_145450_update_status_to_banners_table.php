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
        Schema::table('banners', function (Blueprint $table) {
            $table->tinyInteger('status')->default(1);  // Sử dụng 1 cho trạng thái "active"
        });
    }

    public function down()
    {
        Schema::table('banners', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }

};
