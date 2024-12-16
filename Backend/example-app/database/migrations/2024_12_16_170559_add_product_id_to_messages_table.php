<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddProductIdToMessagesTable extends Migration
{
    public function up()
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->unsignedBigInteger('product_id')->nullable()->after('message'); // Cột product_id, cho phép null
        });
    }

    public function down()
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->dropColumn('product_id');
        });
    }
}


