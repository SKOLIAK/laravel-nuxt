<?php

namespace App\Http\Controllers;

use App\Models\Backtest;
use Illuminate\Http\Request;
use App\Http\Resources\BacktestResource;

class BacktestController extends Controller
{
    public function create(Request $request) {

        $user   = $request->user();
        abort_if(!$user, 403, 'Login first');

        $group = $user->backtestingGroups()->where('id', request('group.id'))->first();
        abort_if(!$group, 400, 'Something went wrong');

        $backtest = $group->backtests()->where('name', request('name'))->where('backtesting_group_id', request('group.id'))->first();

        if ($backtest) {
            return response()->json([
                'status' => 'error',
                'message' => 'Backtest "' .$backtest->name . '" already exists in folder "' . $group->name .'"'
            ]);
        }

        $new = $group->backtests()->create([
            'name' => request('name')
        ]);

        return response()->json([
            'status' => 'ok',
            'message' => 'Backtest has been created',
            'data' => $new->id
        ]);
    }


    public function delete(Request $request) {
        $user   = $request->user();
        abort_if(!$user, 200, 'Login first');

        $group = $user->backtestingGroups()->where('id', request('group_id'))->first();
        abort_if(!$group, 200, 'Something went wrong');

        $backtest = $group->backtests()->where('id', request('id'))->where('backtesting_group_id', request('group_id'))->first();

        $del = false;
        if ($backtest) { $del = $backtest->delete(); }

        return response()->json([
            'status' => $del ? 'ok' : 'error',
            'message' => $del ? 'Backtest has been deleted' : 'Something went wrong'
        ]);
    }

    public function update(Request $request) {
        $user   = $request->user();
        abort_if(!$user, 200, 'Login first');

        $validate = $request->validate([
            'name' => ['required', 'string']
        ]);

        $backtest = Backtest::where('id', request('id'))->first();


        $edit = false;
        if ($backtest) {
            $edit = $backtest->update([
                'name' => request('name')
            ]);
        }

        return response()->json([
            'status' => $edit ? 'ok' : 'error',
            'message' => $edit ? 'Backtest has been updated' : 'Something went wrong'
        ]);
    }

}
