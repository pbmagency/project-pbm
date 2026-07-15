<?php

use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\LabsController;
use App\Http\Controllers\PaymentCallbackController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'landing')->name('home');

// Checkout & payment
Route::get('/checkout', [CheckoutController::class, 'show'])->name('checkout');
Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
Route::get('/payment/return', [CheckoutController::class, 'returnPage'])->name('payment.return');
Route::post('/payment/callback', [PaymentCallbackController::class, 'handle'])->name('payment.callback')->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class]);

Route::post('/analytics/track', [AnalyticsController::class, 'track'])->name('analytics.track');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::redirect('dashboard', '/admin')->name('dashboard');
});

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [AnalyticsController::class, 'index'])->name('analytics');
    Route::get('/export', [AnalyticsController::class, 'export'])->name('analytics.export');

    Route::get('/orders', [AdminOrderController::class, 'index'])->name('orders');
    Route::delete('/orders/{order}', [AdminOrderController::class, 'destroy'])->name('orders.destroy');
    Route::patch('/orders/{order}/status', [AdminOrderController::class, 'updateStatus'])->name('orders.update-status');
    Route::post('/orders/{order}/mark-paid', [AdminOrderController::class, 'markAsPaid'])->name('orders.mark-paid');

    Route::get('/labs', [LabsController::class, 'index'])->name('labs');
    Route::post('/labs/clear-cache', [LabsController::class, 'clearCache'])->name('labs.clear-cache');

    // configs (Now correctly inside the admin group!)
    Route::get('/configs', [\App\Http\Controllers\Admin\ConfigController::class, 'index'])->name('configs');
    Route::post('/configs', [\App\Http\Controllers\Admin\ConfigController::class, 'update'])->name('configs.update');
});

require __DIR__.'/settings.php';