<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\{
    CategoryController,
    BlogCategoryController,
    BlogController,
    RoleController,
    BrandController,
    CommentController,
    AuthController,
    OrderController,
    ImageController,
    CartController,
    ProductController,
    UserController
};
use App\Http\Controllers\Client\{
    OrderController as OrderClient,
    MailController,
    VNPAYController,
    ProductController as ClientProductController,
    CheckoutController,
    CartController as CartClient
};
use App\Http\Controllers\SocialiteController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Client\ProductController as ClientProductController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\Client\CheckoutController;
use App\Http\Controllers\Client\CartController as CartClient;


Route::prefix('admin')->group(function () {
    Route::apiResource('brands', BrandController::class);
    Route::put('brands/update/{id}', [BrandController::class, 'update']);

    Route::apiResource('blog', BlogController::class);
    Route::apiResource('blogcategory', BlogCategoryController::class);
    Route::apiResource('productCategory', CategoryController::class);
    Route::apiResource('comment', CommentController::class);
    Route::put('brands/update/{id}', [BrandController::class, 'update']);
    Route::apiResource('blog', BlogController::class);
    Route::apiResource('role', RoleController::class);
    Route::apiResource('comments', CommentController::class);
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('role', RoleController::class);
    Route::apiResource('products', ProductController::class);
    Route::get('/search', [ProductController::class, 'search']); //http://localhost:8000/api/client/search?query=teneanpham
    Route::apiResource('image', ImageController::class);

    Route::get('/search', [ProductController::class, 'search']); // http://localhost:8000/api/client/search?query=teneanpham

    Route::middleware('auth:api')->group(function () {
        Route::apiResource('cart', CartController::class);
    });

    Route::apiResource('orders', OrderController::class);
    Route::apiResource('employee', UserController::class);
});

// Authentication routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'Register']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:api');

// Socialite authentication routes
Route::get('/auth/redirect/{provider}', [SocialiteController::class, 'authProviderRedirect']);
Route::get('/auth/callback/{provider}', [SocialiteController::class, 'socialAuthentication']);

// Client routes
Route::prefix('client')->group(function () {
    Route::middleware('auth:api')->group(function () {
        Route::apiResource('orders', OrderClient::class);
        Route::post('/checkout', [CheckoutController::class, 'checkout']);
        Route::get('/getAllCart', [CartClient::class, 'getCart']);
        Route::post('/select-cart', [CheckoutController::class, 'showSelectedCartsByIds']);
        Route::post('/buy-now', [CheckoutController::class, 'buyNow']);
        Route::get('/user', [UserController::class, 'getUser']);

        // VNPay payment routes
        Route::post('/vnpay/create-payment', [VNPAYController::class, 'createPayment']);
        Route::get('/vnpay-return', [VNPAYController::class, 'paymentReturn']);
    });
    Route::get('comments/product/{productId}', [CommentController::class, 'getCommentsByProductId']);
    Route::get('/products/search', [ClientProductController::class, 'search']); //http://localhost:8000/api/client/products/search?query=teneanpham
    Route::get('send-mail', [ClientProductController::class, 'sendMail']); //http://localhost:8000/api/client/products/search?query=teneanpham
    Route::post('/contact/send', [MailController::class, 'send']);
    // Route để yêu cầu đặt lại mật khẩu qua API

});

// General user route (outside of client prefix)
Route::middleware('auth:api')->get('/user', [UserController::class, 'getUser']);
Route::middleware('auth:api')->apiResource('comments', CommentController::class);

// Password reset routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'Register']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:api');


Route::post('password/reset', [ResetPasswordController::class, 'reset'])->name('client.reset-password');
Route::middleware('auth:api')->get('/user', [UserController::class, 'getUser']);
Route::middleware('auth:api')->apiResource('comments', CommentController::class);
Route::post('password/send-otp', [ResetPasswordController::class, 'sendOtp']);
Route::post('password/verify-otp', [ResetPasswordController::class, 'verifyOtp']);
Route::post('password/reset', [ResetPasswordController::class, 'resetPassword']);
//login goog
Route::get('/auth/google', [AuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);




