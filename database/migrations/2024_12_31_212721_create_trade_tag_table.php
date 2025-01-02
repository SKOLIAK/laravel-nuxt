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
        Schema::create('trade_tag', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tag_id')->constrained()->cascade();
            $table->foreignUuid('trade_id')->constrained()->cascade();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trade_tag');
    }
};