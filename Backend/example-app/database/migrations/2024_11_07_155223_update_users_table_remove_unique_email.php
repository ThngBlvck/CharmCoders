<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            // Remove the unique constraint from the email column
            $table->string('email')->unique(false)->change();
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            // Re-add the unique constraint on the email column if needed
            $table->string('email')->unique()->change();
        });
    }
};

