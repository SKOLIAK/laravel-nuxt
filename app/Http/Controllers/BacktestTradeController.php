<?php

namespace App\Http\Controllers;

use App\Models\Backtest;
use Illuminate\Http\Request;

class BacktestTradeController extends Controller
{
    public function add(Request $request) {
        $user   = $request->user();
        abort_if(!$user || !request('data') || !request('id'), 200, 'Something went wrong');

        $backtest = Backtest::where('id', request('id'))->first();

        abort_if(!$backtest, 200, 'Backtest not found');

        $x = 0;
        foreach (request('data') as &$trade) {
            $count = $backtest->trades()->where('identifier', $trade['identifier'])->count();

            if (!$count) {
                $backtest->trades()->create($trade);
                $x++;
            }
        }


        return response()->json([
            'status' => 'ok',
            'message' => 'Added ' . $x
        ]);




    }
}
