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





        foreach ($data as $key => $value) {
            $createArray = [];
            foreach ($value as $k => $d) {
                if ($k == 'id') {
                    $createArray['identifier'] = $d;
                } else if ($k == 'account') {
                    $createArray['accounts_id'] = $user->accounts()->firstOrCreate(['name' => $d])->id;
                } else if ($k == 'executions') {
                    $createArray[$k] = json_encode($d);
                } else if (
                    $k == 'symbolDescription' ||
                    $k == 'secOpen' ||
                    $k == 'sec' ||
                    $k == 'tafOpen' ||
                    $k == 'taf' ||
                    $k == 'nsccOpen' ||
                    $k == 'nscc' ||
                    $k == 'nasdaqOpen' ||
                    $k == 'nasdaq' ||
                    $k == 'ecnRemoveOpen' ||
                    $k == 'ecnRemove' ||
                    $k == 'ecnAddOpen' ||
                    $k == 'ecnAdd' ||
                    $k == 'clrBroker'
                ) {
                    // ...
                } else if ($k == 'liq') {
                    $createArray['date_unix_id'] = $dateUnix->id;
                    $createArray['note'] = '';
                } else {
                    $createArray[$k] = $d;
                }
            }
            $x++;
            $user->trades()->create($createArray);
        }

        return response()->json([
            'ok' => true,
            'data' => $x . " Trades has been added",
        ]);
    }

    public function getOpen(Request $request)
    {
        $user = $request->user();
        return $user->trades()->where('openPosition', '1')->get();
    }
}
