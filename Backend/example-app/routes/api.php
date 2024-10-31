<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\BlogCategoryController;
use App\Http\Controllers\Admin\BlogController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\CommentController;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Client\OrderController as OrderClient;
use App\Http\Controllers\Admin\ImageController;
use App\Http\Controllers\Admin\CartController;

use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Client\MailController;
use App\Http\Controllers\SocialiteController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Client\ProductController as ClientProductController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\Client\CheckoutController;
use App\Http\Controllers\Client\CartController as CartClient;


Route::prefix('admin')->group(function () {

    Route::apiResource('brands', BrandController::class);
    Route::apiResource('blog', BlogController::class);
    Route::apiResource('blogcategory', BlogCategoryController::class);
    Route::apiResource('productCategory', CategoryController::class);
    Route::apiResource('comment', CommentController::class);
    Route::put('brands/update/{id}', [BrandController::class, 'update']);
    Route::apiResource('blog', BlogController::class);
    Route::apiResource('role', RoleController::class);
    Route::apiResource('comments', CommentController::class);
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('products', ProductController::class);
    Route::get('/search', [ProductController::class, 'search']); //http://localhost:8000/api/client/search?query=teneanpham
    Route::apiResource('image', ImageController::class);
    Route::middleware('auth:api')->group(function () {
        Route::apiResource('cart', CartController::class);
    });

    Route::apiResource('orders', OrderController::class);
    Route::apiResource('employee', UserController::class);
});
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'Register']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:api');
Route::get('/auth/redirect/{provider}', [SocialiteController::class, 'authProviderRedirect']);
Route::get('/auth/callback/{provider}', [SocialiteController::class, 'socialAuthentication']);

Route::prefix('client')->group(function () {
    Route::middleware('auth:api')->group(function () {
        Route::apiResource('orders', OrderClient::class);
        Route::post('/checkout', [CheckoutController::class, 'checkout']);
        Route::get('/getAllCart', [CartClient::class, 'getCart']);
        Route::post('/select-cart', [CheckoutController::class, 'showSelectedCartsByIds']);
        Route::post('/buy-now', [CheckoutController::class, 'buyNow']);
        Route::get('/user', [UserController::class, 'getUser'])->middleware('auth:api');
    });
});
Route::post('password/send-otp', [ResetPasswordController::class, 'sendOtp']);
Route::post('password/verify-otp', [ResetPasswordController::class, 'verifyOtp']);
Route::post('password/reset', [ResetPasswordController::class, 'resetPassword']);




