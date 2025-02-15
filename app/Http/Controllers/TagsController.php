<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Resources\TagResource;


class TagsController extends Controller
{
    public function index(Request $request) {
        $user = $request->user();
        abort_if(!$user, 400);

        return TagResource::collection($user->tags()->with('group')->get());
    }
}
