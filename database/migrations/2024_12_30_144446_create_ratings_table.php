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
        Schema::create('ratings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('trade_id')->constrained()->cascadeOnDelete();
            $table->integer('preparation')->unsigned()->default(0);
            $table->integer('entry')->unsigned()->default(0);
            $table->integer('stop_loss')->unsigned()->default(0);
            $table->integer('target')->unsigned()->default(0);
            $table->integer('management')->unsigned()->default(0);
            $table->integer('rules')->unsigned()->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ratings');
    }
};
