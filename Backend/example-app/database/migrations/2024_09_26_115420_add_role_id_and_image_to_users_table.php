<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddRoleIdAndImageToUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            // Thêm cột role_id
            $table->unsignedBigInteger('role_id')->after('id')->nullable(); // nullable nếu cần

            // Tạo khóa ngoại cho role_id
            $table->foreign('role_id')->references('id')->on('roles')->onDelete('cascade');

            // Thêm cột image
            $table->string('image')->nullable()->after('email'); // nullable để không bắt buộc phải có ảnh
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            // Xóa khóa ngoại và cột role_id
            $table->dropForeign(['role_id']);
            $table->dropColumn('role_id');

            // Xóa cột image
            $table->dropColumn('image');
        });
    }
}


