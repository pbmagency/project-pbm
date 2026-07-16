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
        Schema::create('mini_audits', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('email');
            $table->string('whatsapp');
            $table->string('website');
            $table->string('traffic');
            $table->string('omzet');
            $table->string('budget_iklan')->nullable(); // sudah digabung
            $table->string('tantangan');
            $table->string('tantangan_lainnya')->nullable();
            $table->boolean('is_qualified')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mini_audit');
    }
};
