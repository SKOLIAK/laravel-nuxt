<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Resources\SessionResource;

class SessionController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        abort_if(!$user, 403);

        return SessionResource::collection($user->sessions);
    }
}
