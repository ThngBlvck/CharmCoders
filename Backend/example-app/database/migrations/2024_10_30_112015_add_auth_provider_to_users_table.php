<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddAuthProviderToUsersTable extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('auth_provider')->nullable(); // Lưu tên nhà cung cấp (Google, Facebook, etc.)
            $table->string('auth_provider_id')->nullable(); // Lưu ID người dùng từ nhà cung cấp
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['auth_provider', 'auth_provider_id']);
        });
    }
}
