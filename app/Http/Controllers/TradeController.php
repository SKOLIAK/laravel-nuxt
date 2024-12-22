<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Trade;
use App\Models\DateUnix;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;


class TradeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $user = User::first();
        abort_if(!$user, 403);

        $trades = [];
        $unixes = $user->dateUnix()->get();

        foreach ($unixes as $key => $value) {
            $trades[$value->date_unix] = [
                'trades' => $user->trades()->where(['date_unix_id' => $value['id']])->get()->toArray()
            ];
        }

        return response()->json([
            'ok' => true,
            'data' => $trades,
        ]);
    }

    public function add(Request $request) {

        $request->validate([
            'date_unix' => ['required', 'numeric'],
            'trades' => ['required']
        ]);
        $user = $request->user();
        abort_if(!$user, 403);
        $data = $request['trades'];



        $dateUnix = $user->dateUnix()->firstOrCreate(['date_unix' => $request['date_unix']]);
        $x = 0;


        for ($i=0; $i < sizeof($data); $i++) {


            $account = $user->accounts()->firstOrCreate(['name' => $data[$i]['account']]);

            $user->trades()->create([
                'identifier'        => $data[$i]['id'],

                // ASSOCIATIONS
                'date_unix_id'      => $dateUnix->id,
                'accounts_id'       => $account->id,

                'broker'            => $data[$i]['broker'],
                'td'                => $data[$i]['td'],
                'currency'          => $data[$i]['currency'],
                'type'              => $data[$i]['type'],
                'side'              => $data[$i]['side'],
                'strategy'          => $data[$i]['strategy'],
                'buyQuantity'       => $data[$i]['buyQuantity'],
                'sellQuantity'      => $data[$i]['sellQuantity'],
                'symbol'            => $data[$i]['symbol'],
                'symbolOriginal'    => $data[$i]['symbolOriginal'],
                'entryTime'         => $data[$i]['entryTime'],
                'exitTime'          => $data[$i]['exitTime'],
                'entryPrice'        => $data[$i]['entryPrice'],
                'exitPrice'         => $data[$i]['exitPrice'],
                'commissionOpen'    => $data[$i]['commissionOpen'],
                'commission'        => $data[$i]['commission'],
                'grossEntryProceedsOpen'        => $data[$i]['grossEntryProceedsOpen'],
                'grossEntryProceeds'        => $data[$i]['grossEntryProceeds'],
                'grossExitProceedsOpen'        => $data[$i]['grossExitProceedsOpen'],
                'grossExitProceeds'        => $data[$i]['grossExitProceeds'],
                'grossProceedsOpen'        => $data[$i]['grossProceedsOpen'],
                'grossProceeds'        => $data[$i]['grossProceeds'],
                'grossWins'        => $data[$i]['grossWins'],
                'grossLoss'        => $data[$i]['grossLoss'],
                'grossSharePL'        => $data[$i]['grossSharePL'],
                'grossSharePLWins'        => $data[$i]['grossSharePLWins'],
                'grossSharePLLoss'        => $data[$i]['grossSharePLLoss'],
                'grossStatus'        => $data[$i]['grossStatus'],
                'netEntryProceedsOpen'        => $data[$i]['netEntryProceedsOpen'],
                'netEntryProceeds'        => $data[$i]['netEntryProceeds'],
                'netExitProceedsOpen'        => $data[$i]['netExitProceedsOpen'],
                'netExitProceeds'        => $data[$i]['netExitProceeds'],
                'netProceedsOpen'        => $data[$i]['netProceedsOpen'],
                'netProceeds'        => $data[$i]['netProceeds'],
                'netWins'        => $data[$i]['netWins'],
                'netLoss'        => $data[$i]['netLoss'],
                'netSharePL'        => $data[$i]['netSharePL'],
                'netSharePLWins'        => $data[$i]['netSharePLWins'],
                'netSharePLLoss'        => $data[$i]['netSharePLLoss'],
                'netStatus'        => $data[$i]['netStatus'],
                'executionsCount'        => $data[$i]['executionsCount'],
                'tradesCount'        => $data[$i]['tradesCount'],
                'grossWinsQuantity'        => $data[$i]['grossWinsQuantity'],
                'grossWinsCount'        => $data[$i]['grossWinsCount'],
                'netWinsQuantity'        => $data[$i]['netWinsQuantity'],
                'netLossQuantity'        => $data[$i]['netLossQuantity'],
                'netWinsCount'        => $data[$i]['netWinsCount'],
                'netLossCount'        => $data[$i]['netLossCount'],
                'note'              => 'Note...',
                'executions'        => json_encode($data[$i]['executions'])
            ]);

            $x++;
        }

        return response()->json([
            'ok' => true,
            'data' => $x . " Trades has been added",
        ]);
    }

    public function getOpen(Request $request) : Array
    {
        $user = User::first();
       // $user = $request->user();
        $trades = $user->trades()->where('exitTime', 0)->get()->toArray();
        return $trades;
    }
}
