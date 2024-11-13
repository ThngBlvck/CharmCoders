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
    UserController,
    ReportExportController
};
use App\Http\Controllers\Client\{
    OrderController as OrderClient,
    MailController,
    VNPAYController,
    ProductController as ClientProductController,
    CheckoutController,
    CartController as CartClient,
    PaymentController,
    AddressController,
    MomoPaymentController
};
use App\Http\Controllers\Auth\SocialiteController;
use App\Http\Controllers\Auth\ResetPasswordController;


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
    Route::apiResource('image', ImageController::class);// http://localhost:8000/api/client/search?query=teneanpham

    Route::middleware('auth:api')->group(function () {
        Route::apiResource('orders', OrderController::class);
        Route::apiResource('cart', CartController::class);
    });
    Route::middleware('auth:api')->post('request-export-report', [ReportExportController::class, 'export']);
    Route::apiResource('employee', UserController::class);
});

// Authentication routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'Register']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:api');
Route::middleware(['web'])->group(function () {
    Route::get('/auth/redirect/{provider}', [SocialiteController::class, 'authProviderRedirect']);
    Route::get('/auth/{provider}/callback', [SocialiteController::class, 'socialAuthentication']);
});
Route::prefix('client')->group(function () {
    Route::middleware('auth:api')->group(function () {
        Route::apiResource('orders', OrderClient::class);
        Route::get('/getAllCart', [CartClient::class, 'getCart']);
        Route::post('/select-cart', [CheckoutController::class, 'showSelectedCartsByIds']);
        Route::post('/buy-now', [CheckoutController::class, 'buyNow']);
        Route::get('/user', [UserController::class, 'getUser']);

        #payment
        Route::post('/checkout', [PaymentController::class, 'checkout']);
        Route::get('/payment-return', [PaymentController::class, 'paymentReturn']);
        Route::get('/user', [UserController::class, 'getUser'])->middleware('auth:api');
        Route::apiResource('comments', CommentController::class);
    });
    Route::get('comments/product/{productId}', [CommentController::class, 'getCommentsByProductId']);
    Route::get('/products/search', [ClientProductController::class, 'search']); //http://localhost:8000/api/client/products/search?query=teneanpham
    Route::post('/contact/send', [MailController::class, 'sendMail']);
    Route::get('products/related/{id}', [ClientProductController::class, 'getRelatedProducts']);
    Route::get('products/hot', [ClientProductController::class, 'getHotProducts']);
    // Route để yêu cầu đặt lại mật khẩu qua API

    Route::get('comments/product/{productId}', [CommentController::class, 'getCommentsByProductId']);
    Route::get('/products/search', [ClientProductController::class, 'search']); //http://localhost:8000/api/client/products/search?query=teneanpham
    Route::get('send-mail', [ClientProductController::class, 'sendMail']); //http://localhost:8000/api/client/products/search?query=teneanpham
    Route::post('/contact/send', [MailController::class, 'send']);

    //profile user
    Route::put('/profile/{id}', [UserController::class, 'profile'])->middleware('auth:api');
    //adress
    Route::apiResource('/address', AddressController::class)->middleware('auth:api');
    //change password
    Route::put('/changepassword', [UserController::class, 'changePassword'])->middleware('auth:api');
    Route::post('/payment/momo', [MomoPaymentController::class, 'createPayment']);
    Route::get('/payment/redirect', [MomoPaymentController::class, 'handleRedirect']);

});

// General user route (outside of client prefix)
Route::middleware('auth:api')->get('/user', [UserController::class, 'getUser']);
Route::middleware('auth:api')->apiResource('comments', CommentController::class);

// Password reset routes


Route::middleware('auth:api')->apiResource('comments', CommentController::class);
Route::post('password/send-otp', [ResetPasswordController::class, 'sendOtp']);
Route::post('password/verify-otp', [ResetPasswordController::class, 'verifyOtp']);
Route::post('password/reset', [ResetPasswordController::class, 'resetPassword']);





