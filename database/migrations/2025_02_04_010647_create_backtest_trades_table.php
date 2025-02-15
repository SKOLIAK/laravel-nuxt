<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('backtest_trades', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('identifier');
            $table->string('strategy');
            $table->string('symbol');
            $table->string('symbol_tw');
            $table->string('symbolOriginal');
            $table->bigInteger('entryTime');
            $table->bigInteger('exitTime');
            $table->string('timeframe');
            $table->integer('day_of_week');
            $table->string('session');
            $table->float('entry');
            $table->float('target');
            $table->float('stop');
            $table->float('quantity');
            $table->string('outcome');
            $table->float('rrr');
            $table->float('netProceeds');
            $table->float('gain');
            $table->foreignUuid('backtest_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('backtest_trades');
    }
};
