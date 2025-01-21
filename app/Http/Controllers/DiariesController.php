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
        abort_if(!$request->user(), 401, 'Not authorised');

        return DiaryResource::collection($request->user()->diaries()->orderBy('created_at', 'DESC')->get())->response();
    }

    public function add(Request $request) : JsonResponse
    {
        abort_if(!$request->user(), 401, 'Not authorised');

        $validate = $request->validate([
            'content' => ['required', 'string'],
            'created' => ['required', 'date']
        ]);

        $create = $request->user()->diaries()->create($request->only(['content']));
        $create->update(['created_at' => $request->created]);


        return response()->json([
            'status' => true,
            'response' => $create->id
        ]);
    }

    public function update(Request $request) : JsonResponse
    {
        abort_if(!$request->user(), 401, 'Not authorised');
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
        abort_if(!$request->user(), 401, 'Not authorised');

        $diary = Diaries::where('id', $request->id)->first();

        abort_if(!$diary, 404);

        return new DiaryResource($diary);
    }

    public function destroy(Request $request)
    {
        abort_if(!$request->user(), 401, 'Not authorised');
        $diary = Diaries::where('id', $request->id)->delete();

        return response()->json([
            'ok' => $diary,
            'message' => $diary ? 'Diary has been deleted' : 'Something went wrong'
        ], 201);
    }
}
