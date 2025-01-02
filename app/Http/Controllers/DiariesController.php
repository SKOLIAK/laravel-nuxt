<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Diaries;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Resources\DiaryResource;

class DiariesController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        abort_if(!$user, 403);

        return DiaryResource::collection($user->diaries()->orderBy('created_at', 'DESC')->get())->response();
    }

    public function add(Request $request) : JsonResponse
    {
        $user = $request->user();

        $validate = $request->validate([
            'content' => ['required', 'string'],
            'created' => ['required', 'date']
        ]);

        $create = $user->diaries()->create($request->only(['content']));
        $create->update(['created_at' => $request->created]);


        return response()->json([
            'status' => true,
            'response' => $create->id
        ]);
    }

    public function update(Request $request) : JsonResponse
    {
        $user = $request->user();
        $request->validate([
            'content' => ['required', 'string'],
            'flagged' => ['required', 'boolean']
        ]);

        $diary = Diaries::find($request->id)->update($request->only(['content', 'flagged']));

        abort_if(!$diary, 404);

        return response()->json([
            'ok' => $diary,
            'message' => $diary ? 'Diary has been updated' : 'An error occured. Try again later'
        ], $diary ? 201 : 500);
    }

    public function get(Request $request)
    {
        $user = $request->user();

        $diary = Diaries::where('id', $request->id)->first();

        abort_if(!$diary, 404);

        return new DiaryResource($diary);
    }

    public function destroy(Request $request)
    {
        $diary = Diaries::where('id', $request->id)->delete();

        return response()->json([
            'ok' => $diary,
            'message' => $diary ? 'Diary has been deleted' : 'Something went wrong'
        ], 201);
    }
}
