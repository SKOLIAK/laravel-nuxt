<?php

use App\Models\User;
use App\Models\Accounts;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('trades', function (Blueprint $table) {
            $table->uuid('id')->primary();


            $table->string('identifier');
            $table->string('account');
            $table->string('broker');
            $table->string('td');
            $table->string('currency');
            $table->string('type');
            $table->string('side');
            $table->string('symbolOriginal');
            $table->string('symbol');


            $table->string('buyQuantity');
            $table->string('sellQuantity');

            $table->string('strategy');

            $table->string('entryTime');
            $table->string('exitTime')->default(0);
            $table->string('entryPrice');
            $table->string('exitPrice')->nullable(true);


             /*******************
            * Commissions and fees
            *******************/
            $table->string('commissionOpen')->default(0);
            $table->string('commission')->default(0);

            /*******************
             * Gross proceeds and P&L
            *******************/
            $table->string('grossEntryProceedsOpen')->default(0);
            $table->string('grossEntryProceeds')->default(0);
            $table->string('grossExitProceedsOpen')->default(0);
            $table->string('grossExitProceeds')->default(0);
            $table->string('grossProceedsOpen')->default(0);
            $table->string('grossProceeds')->default(0);
            $table->string('grossWins')->default(0);
            $table->string('grossLoss')->default(0);
            $table->string('grossSharePL')->default(0);
            $table->string('grossSharePLWins')->default(0);
            $table->string('grossSharePLLoss')->default(0);
            $table->string('grossStatus')->nullable(true);

            /*******************
             * Net proceeds and P&L
            *******************/
            $table->string('netEntryProceedsOpen')->default(0);
            $table->string('netEntryProceeds')->default(0);
            $table->string('netExitProceedsOpen')->default(0);
            $table->string('netExitProceeds')->default(0);
            $table->string('netProceedsOpen')->default(0);
            $table->string('netProceeds')->default(0);
            $table->string('netWins')->default(0);
            $table->string('netLoss')->default(0);
            $table->string('netSharePL')->default(0);
            $table->string('netSharePLWins')->default(0);
            $table->string('netSharePLLoss')->default(0);
            $table->string('netStatus')->default(0);


            /*******************
            * Counts
            *******************/
            $table->string('executionsCount')->default(0);
            $table->string('tradesCount')->default(0);
            $table->string('grossWinsQuantity')->default(0);
            $table->string('grossLossQuantity')->default(0);
            $table->string('grossWinsCount')->default(0);
            $table->string('grossLossCount')->default(0);
            $table->string('netWinsQuantity')->default(0);
            $table->string('netLossQuantity')->default(0);
            $table->string('netWinsCount')->default(0);
            $table->string('netLossCount')->default(0);



            /*******************
            * Other
            *******************/
            $table->string('note');
            $table->string('executions');
            $table->boolean('openPosition')->default(true);



            $table->foreignUuid('accounts_id')->constrained();
            $table->foreignUuid('user_id')->constrained();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trades');
    }
};
