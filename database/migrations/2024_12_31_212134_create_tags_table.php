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
        Schema::create('tags', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->foreignUuid('user_id')->constrained()->cascade();
        });

        Schema::create('trade_tag', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('tag_id')->constrained()->cascade();
            $table->foreignUuid('trade_id')->constrained()->cascade();
        });

        Schema::create('tag_groups', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('color')->default('#000000');
            $table->foreignUuid('user_id')->constrained()->cascade();
        });

        Schema::create('date_unix_tags', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('tag_id')->constrained()->cascade();
            $table->foreignUuid('date_unix_id')->constrained()->cascade();
        });

        Schema::table('tags', function (Blueprint $table) {
            $table->foreignUuid('tag_group_id')->constrained()->cascade();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tags');
    }
};
