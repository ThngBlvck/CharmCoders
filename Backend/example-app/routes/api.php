<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\BlogCategoryController;
use App\Http\Controllers\Admin\BlogController;
use App\Http\Controllers\Admin\RoleController;





use App\Http\Controllers\Admin\BrandController;

Route::prefix('admin')->group(function () {
    Route::apiResource('brands', BrandController::class);
    Route::apiResource('blog', BlogController::class);
    Route::apiResource('blogCategory', BlogCategoryController::class);
    Route::apiResource('productCategory', CategoryController::class);
    Route::apiResource('role', RoleController::class);
});
