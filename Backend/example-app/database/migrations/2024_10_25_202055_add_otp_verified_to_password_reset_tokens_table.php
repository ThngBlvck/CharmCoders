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
        Schema::table('password_reset_tokens', function (Blueprint $table) {
            $table->boolean('otp_verified')->default(false);
        });
    }

    public function down()
    {
        Schema::table('password_reset_tokens', function (Blueprint $table) {
            $table->dropColumn('otp_verified');
        });
    }
};
