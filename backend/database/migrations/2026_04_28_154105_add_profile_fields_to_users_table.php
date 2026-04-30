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
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable()->after('email');
            $table->string('cpf', 14)->unique()->nullable()->after('phone');
            $table->date('birthDate')->nullable();
            $table->string('avatar')->nullable();
            $table->unsignedBigInteger('defaultAddressId')->nullable();
            $table->unsignedBigInteger('defaultPaymentMethodId')->nullable();
            $table->json('preferences')->nullable(); // Para newsletter, sms, etc.
            $table->boolean('twoFactorEnabled')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['phone', 'cpf', 'birthDate', 'avatar', 'defaultAddressId', 'defaultPaymentMethodId', 'preferences', 'twoFactorEnabled']);
        });
    }
};
