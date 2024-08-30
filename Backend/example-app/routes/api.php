<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\BlogCategoryController;
use App\Http\Controllers\Admin\BlogController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ImageController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');























use App\Http\Controllers\Admin\BrandController;

Route::prefix('admin')->group(function () {

    Route::apiResource('brands', BrandController::class);

    Route::apiResource('blogcategory', BlogCategoryController::class);
    Route::apiResource('blog', BlogController::class);


    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('products', ProductController::class);
    Route::apiResource('image', ImageController::class);
});


