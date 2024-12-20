<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Trade;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;


class TradeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        abort_if(!$user, 403);

        return response()->json([
            'ok' => true,
            'data' => [
                ...$user->trades()->get()
            ],
        ]);
    }

    public function add(Request $request) {


        return response()->json([
            'ok' => false,
        ], 201);
    }

    public function getOpen(Request $request) : Array
    {
        $user = User::first();
       // $user = $request->user();
        $trades = $user->trades()->where('exitTime', 0)->get()->toArray();
        return $trades;
    }
}
