<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\CategoryController;

// Route::get('categories', [CategoryController::class, 'index'])->name('index');
Route::get('/', function () {
    return view('welcome');
});
