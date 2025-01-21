<?php

namespace App\Http\Controllers;

use App\Models\User;
use Spatie\Tags\Tag;
use App\Models\Trade;
use App\Models\DateUnix;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Resources\TradeResource;
use App\Http\Resources\DateUnix\DateUnixTradesResource;


class TradeController extends Controller
{

    public function update(Request $request) {

        $user = $request->user();
        $user = User::first();
        abort_if(!$user, 400);

        $trade = $user->trades->where('identifier', $request['data']['id'])->first();

        if ($trade && $request['data']['ratings']) {
            $trade->rating()->update($request['data']['ratings']);
        }

        $trade->update([
            'note' => $request['data']['note'] == null ? '' : $request['data']['note']
        ]);


        $trade->tags()->detach();

        foreach ($request['data']['tags'] as $tag) {
            $trade->tags()->attach($tag['id']);
        }


        if($request['data']['screenshot'] != '') {
            $trade->screenshots()->create([
                'file' => $request['data']['screenshot'],
                'user_id' => $user->id
            ]);
        }

        return new TradeResource($trade);
    }

    public function show(Request $request) {
        $user = $request->user();
        abort_if(!$user, 400);
        return new TradeResource($user->trades()->where('identifier', $request['id'])->first());
    }

    public function index(Request $request)
    {
        $user = $request->user();
        $user = User::first();
        abort_if(!$user, 400);
        return DateUnixTradesResource::collection(
            $user->dateUnix()->with('tags')->whereHas('trades', function($q) {
                $q->whereHas('rating');
            })->get()
        );
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
            $trade = $user->trades()->create($createArray);
            $trade->rating()->create([
                'user_id' => $user->id
            ]);
        }

        return response()->json([
            'ok' => true,
            'data' => $x . " Trades has been added",
        ]);
    }

    public function getOpen(Request $request)
    {
        $user = $request->user();
        abort_if(!$user, 403);
        return $user->trades()->where('openPosition', '1')->get();
    }


    public function rate(Request $request)
    {
        $user = $request->user();
        abort_if(!$user, 403);

        $unix = $user->dateUnix()->where('date_unix', request('unix'))->first();

        if ($unix) {
            $unix->update([
                'rating' => $unix->rating == request('rating') ? 0 : request('rating')
            ]);
        }

        return response()->json([
            'rating' => $unix->rating,
        ]);

    }
}
