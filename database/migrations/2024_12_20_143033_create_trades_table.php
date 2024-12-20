<?php

use App\Models\User;
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

            $table->string('stategy');

            $table->date('entryTime');
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
            $table->string('netEntryProceedsOpen');
            $table->string('netEntryProceeds');
            $table->string('netExitProceedsOpen');
            $table->string('netExitProceeds');
            $table->string('netProceedsOpen');
            $table->string('netProceeds');
            $table->string('netWins');
            $table->string('netLoss');
            $table->string('netSharePL');
            $table->string('netSharePLWins');
            $table->string('netSharePLLoss');
            $table->string('netStatus');


            /*******************
            * Counts
            *******************/
            $table->string('executionsCount');
            $table->string('tradesCount');
            $table->string('grossWinsQuantity');
            $table->string('grossLossQuantity');
            $table->string('grossWinsCount');
            $table->string('grossLossCount');
            $table->string('netWinsQuantity');
            $table->string('netLossQuantity');
            $table->string('netWinsCount');




            /*******************
            * Other
            *******************/
            $table->string('note');
            $table->string('executions');
            $table->boolean('openPosition')->default(true);



            $table->foreignId('user_id')->constrained();
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
