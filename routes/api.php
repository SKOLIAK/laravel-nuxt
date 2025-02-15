<?php

use App\Models\User;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TagsController;
use App\Http\Controllers\TradeController;
use App\Http\Controllers\RatingController;
use App\Http\Controllers\UploadController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\DiariesController;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\AccountsController;
use App\Http\Controllers\BacktestController;
use App\Http\Controllers\TagGroupController;
use App\Http\Controllers\ScreenshotController;
use App\Http\Controllers\BacktestTradeController;
use App\Http\Controllers\BacktestingGroupController;

Route::get('/', function () {
    return ['ok' => true, 'message' => 'Welcome to the API'];
});

Route::prefix('api/v1')->group(function () {
    Route::get('login/{provider}/redirect', [AuthController::class, 'redirect'])->name('login.provider.redirect');
    Route::get('login/{provider}/callback', [AuthController::class, 'callback'])->name('login.provider.callback');
    Route::post('login', [AuthController::class, 'login'])->middleware('throttle:login')->name('login');
    Route::post('register', [AuthController::class, 'register'])->name('register');
    Route::post('forgot-password', [AuthController::class, 'sendResetPasswordLink'])->middleware('throttle:5,1')->name('password.email');
    Route::post('reset-password', [AuthController::class, 'resetPassword'])->name('password.store');
    Route::post('verification-notification', [AuthController::class, 'verificationNotification'])->middleware('throttle:verification-notification')->name('verification.send');
    Route::get('verify-email/{ulid}/{hash}', [AuthController::class, 'verifyEmail'])->middleware(['signed', 'throttle:6,1'])->name('verification.verify');

    Route::middleware(['auth:sanctum'])->group(function () {
        Route::post('logout', [AuthController::class, 'logout'])->name('logout');
        Route::post('devices/disconnect', [AuthController::class, 'deviceDisconnect'])->name('devices.disconnect');
        Route::get('devices', [AuthController::class, 'devices'])->name('devices');
        Route::get('user', [AuthController::class, 'user'])->name('user');

        Route::post('account/update', [AccountController::class, 'update'])->name('account.update');
        Route::post('account/password', [AccountController::class, 'password'])->name('account.password');

        Route::middleware(['throttle:uploads'])->group(function () {
            Route::post('upload', [UploadController::class, 'image'])->name('upload.image');
        });

        Route::get('accounts', [AccountsController::class, 'index'])->name('accounts.get');
        Route::post('accounts', [AccountsController::class, 'add'])->name('accounts.add');

        Route::get('trades', [TradeController::class, 'index'])->name('trades.get');
        Route::post('trades', [TradeController::class, 'add'])->name('trades.add');
        Route::get('trades/open', [TradeController::class, 'getOpen'])->name('trades.getOpen');
        Route::post('trades/rate', [TradeController::class, 'rate'])->name('trades.rate');



        // Backtesting folders
        Route::delete('backtesting/groups', [BacktestingGroupController::class, 'delete'])->name('backtesting.groups.delete');
        Route::get('backtesting/groups', [BacktestingGroupController::class, 'index'])->name('backtesting.groups.get');
        Route::post('backtesting/groups', [BacktestingGroupController::class, 'add'])->name('backtesting.groups.add');

        // Individual backtests
        Route::post('backtesting', [BacktestController::class, 'create']);
        Route::delete('backtesting', [BacktestController::class, 'delete']);
        Route::put('backtesting', [BacktestController::class, 'update']);

        // Add Trades for a backtest
        Route::post('backtesting/trades', [BacktestTradeController::class, 'add']);

        Route::delete('screenshots', [ScreenshotController::class, 'delete'])->name('delete.screnshot');

        Route::get('diaries', [DiariesController::class, 'index']);
        Route::post('diaries', [DiariesController::class, 'add']);
        Route::put('diaries', [TradeController::class, 'update']);
        Route::get('diaries/{id}', [DiariesController::class, 'get']);
        Route::delete('diaries/{id}', [DiariesController::class, 'destroy']);


        Route::get('tags', [TagsController::class, 'index']);
        Route::get('tags/groups', [TagGroupController::class, 'index'])->name('tags');
        Route::post('tags/groups', [TagGroupController::class, 'update'])->name('tags');


        /**
         * Trading Sessions
         */
        Route::get('sessions', [SessionController::class, 'index']);
        Route::put('sessions', [SessionController::class, 'create']);
        Route::post('sessions', [SessionController::class, 'update']);
        Route::delete('sessions', [SessionController::class, 'delete']);



    });

    Route::get('trades', [TradeController::class, 'index'])->name('trades.get');
    Route::put('trades', [TradeController::class, 'update'])->name('trades.update');
    Route::get('trades/{id}', [TradeController::class, 'show'])->name('trades.show');
    Route::get('ratings', [RatingController::class, 'index'])->name('rating');



    Route::get('tags', [TagsController::class, 'index']);

    Route::get('dev', [SessionController::class, 'index'])->name('tags');
});
