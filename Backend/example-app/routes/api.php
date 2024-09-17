<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\BlogCategoryController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

use App\Http\Controllers\Admin\BrandController;

Route::prefix('admin')->group(function () {

    Route::apiResource('brands', BrandController::class);

    Route::apiResource('blogCategory', BlogCategoryController::class);

    Route::apiResource('categories', CategoryController::class);

});
