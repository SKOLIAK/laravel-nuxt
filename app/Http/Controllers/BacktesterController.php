<?php

namespace App\Http\Controllers;

use App\Models\Backtest;
use Illuminate\Http\Request;
use App\Models\BacktestTrade;
use App\Models\BacktestingGroup;
use App\Http\Resources\BacktestResource;
use App\Http\Resources\Backtesting\FolderResource;

/**
 * TODO: @function updateBacktest()  -  Add other data silently
 */
class BacktesterController extends Controller
{
    /** Checks if folder exists and returns it */
    private function validateFolder($folder_id) {
        abort_if(!$folder_id || !strlen($folder_id), 403, 'Access Denied.');
        $folder = BacktestingGroup::find($folder_id);
        abort_if(!$folder, 404, 'Not Found.');
        return $folder;
    }

    /** Get all backtesting folders associated with the user */
    public function getFolders(Request $request) {
        return FolderResource::collection($request->user()->backtestingGroups);
    }

    /** Delete specific folder */
    public function deleteFolder(Request $request) {
        $folder = $this->validateFolder($request['id']);

        /** Return an ID to remove from the client data array */
        $id = $folder->id;
        $name = $folder->name;
        $folder->delete();

        return response()->json([
            'status' => 'ok',
            'message' => 'Folder `' . $name . '` has been deleted',
            'data' => [
                'id' => $id
            ]
        ]);
    }

    /** Update specific folder */
    public function updateFolder(Request $request) {
        $folder = $this->validateFolder($request['id']);
        $request->validate([
            'name' => ['required', 'string'],
            'color' => ['required']
        ]);

        $folder->update([
            'name'  => $request['name'],
            'color' => $request['color']
        ]);

        return response()->json([
            'status' => 'ok',
            'message' => 'Folder `' . $folder->name . '` has been updated',
            'data' => [
                'id' => $folder->id,
                'name' => $folder->name,
                'color' => $folder->color
            ]
        ]);
    }

    /** Create new folder */
    public function createFolder(Request $request) {

        $request->validate([
            'name' => ['required', 'string'],
            'color' => ['required']
        ]);

        $folder = $request->user()->backtestingGroups()->where('name', $request['name'])->first();
        abort_if($folder, 409,  'You already have a folder named `' . $request['name'] . '`');

        $folder = $request->user()->backtestingGroups()->create([
            'name'  => $request['name'],
            'color' => $request['color']
        ]);

        return response()->json([
            'status' => 'ok',
            'message' => 'Folder `' . $folder->name . '` has been created',
            'data' => [
                'id' => $folder->id,
                'name' => $folder->name,
                'color' => $folder->color
            ]
        ]);
    }

    /** Checks if backtest exists and returns it */
    private function validateBacktest($backtest_id) {
        abort_if(!$backtest_id || !strlen($backtest_id), 403, 'Access Denied.');
        $backtest = Backtest::find($backtest_id);
        abort_if(!$backtest, 404, 'Not Found.');
        return $backtest;
    }

    /** Get all backtests associated with the given folder */
    public function getBacktests(Request $request) {
        $folder = $this->validateFolder($request['id']);
        return BacktestResource::collection($folder->backtests);
    }

    /** Create a new backtest in a specific folder */
    public function createBacktest(Request $request) {
        $folder = $this->validateFolder($request['folder']);

        $request->validate([
            'name' => ['required', 'string']
        ]);

        abort_if(
            count($folder->backtests->where('name', $request['name'])), 409, 
            'Backtest with that name already exists in `' . $folder->name . '` folder'
        );

        $backtest = $folder->backtests()->create([
            'name' => $request['name']
        ]);

        return response()->json([
            'status' => 'ok',
            'message' => 'Backtest `' . $backtest->name . '` has been created',
            'data' => $backtest->id
        ]);
    }

    /** Update a specific backtest */
    public function updateBacktest(Request $request) {
        $backtest = $this->validateBacktest($request['id']);
        $folder = $this->validateFolder($request['folder']);

        if(isset($request['trades']) && count($request['trades'])) {
            $x = 0;
            foreach (request('trades') as &$trade) {
                $count = $backtest->trades()->where('identifier', $trade['identifier'])->count();
    
                if (!$count) {
                    $backtest->trades()->create($trade);
                    $x++;
                } else {
                    $backtest->trades()->where('identifier', $trade['identifier'])->update([
                        'session' => $trade['session']
                    ]);
                }
            }
        }

        $request->validate([
            'name' => ['required', 'string']
        ]);

        $backtest->update([
            'name' => $request['name'],
            'backtesting_group_id' => $folder->id
        ]);

        return response()->json([
            'status' => 'ok',
            'message' => 'Backtest has been updated',
            'data' => $backtest->id
        ]);
    }

    /** Delete a specific backtest with all trades in it */
    public function deleteBacktest(Request $request) { 
        $backtest = $this->validateBacktest($request['id']);
        $name = $backtest->name;
        $backtest->delete();
        return response()->json([
            'status' => 'ok',
            'message' => 'Backtest `' . $name . '` has been deleted'
        ]);
    }

    private function validateTrade($trade_id) {
        abort_if(!$trade_id || !strlen($trade_id), 403, 'Access Denied.');
        $trade = BacktestTrade::find($trade_id);
        abort_if(!$trade, 404, 'Not Found.');
        return $trade;
    }

    public function updateTrade(Request $request) { 
        $trade = $this->validateTrade($request['id']);

        $request->validate([
            'direction' => ['required', 'string'],
            'session' => ['required', 'string'],
        ]);

        // todo: Add other fields
        $trade->update([
            'direction' => in_array($request['direction'], ['long', 'short']) ? $request['direction'] : 'long',
            'session' => $request['session'] // todo: Check user sessions first
        ]);

        return response()->json([
            'status' => 'ok',
            'message' => '`' . $trade->symbolOriginal . '` Trade has been updated'
        ]);
    }

    public function deleteTrades(Request $request) { 
        $folder = $this->validateFolder($request['folder']);
        $backtest = $this->validateBacktest($request['backtest']);
        if(!empty($request['trades'])) {
            $backtest->trades()->whereIn('identifier', $request['trades'])->delete();
        }

        return response()->json([
            'status' => 'ok',
            'message' => count($request['trades']) . ' Trades have been deleted'
        ]);
    }
}
