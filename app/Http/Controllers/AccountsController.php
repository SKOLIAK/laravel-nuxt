<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Resources\AccountsResource;

class AccountsController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        abort_if(!$user, 403);

        return AccountsResource::collection($user->accounts);
    }

    public function add(Request $request) : JsonResponse
    {
        $user = $request->user();

        abort_if(!$user, 403);

        $request->validate([
            'account' => ['required', 'string'],
        ]);

        $create = $user->accounts()->create([
            'name' => $request['account']
        ]);

        return response()->json([
            'message' => $create ? 'Account has been added' : 'Error while adding account'
        ]);
    }
}
