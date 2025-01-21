<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Resources\TagGroupResource;

class TagGroupController extends Controller
{
    public function index(Request $request) {
        //abort_if(!$request->user(), 401, 'Not authorised');

        return response()->json([
            'status' => 'ok',
            'data' => TagGroupResource::collection(User::first()->tag_groups)
        ]);
    }

    public function create(Request $request) {
        abort_if(!$request->user(), 401, 'Not authorised');

        $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:20']
        ]);

        if ($request->user()) {
            $request->user()->tag_groups()->create([
                'name' => request('name'),
                'color' => request('color') ?? '#000000'
            ]);
        }

        return response()->json([
            'status' => 'ok'
        ]);
    }

    public function update(Request $request) {
        abort_if(!$request->user() || !$request['data'], 401, 'Not authorised');

        foreach ($request['data'] as $key => $value) {
            if (isset($value['id'])) {
                $groupCollection = $request->user()->tag_groups->where('id', $value['id'])->first();
                $groupCollection->update([
                    'name' => $value['name'],
                    'color' => $value['color']
                ]);

                foreach ($value['tags'] as $tag) {
                    $tagCollection = $request->user()->tags->where('id', $tag['id'])->first();
                    $tagCollection->update([
                        'name' => $tag['name'],
                        'tag_group_id' => $value['id']
                    ]);
                }
            } else {
                $newGroup = $request->user()->tag_groups()->create([
                    'name' => $value['name'],
                    'color' => $value['color']
                ]);

                foreach ($value['tags'] as $tag) {
                    if(isset($tag['id'])) {
                        $tagCollection = $request->user()->tags()->update([
                            'name' => $tag['name'],
                            'tag_group_id' => $newGroup->id
                        ]);
                    } else {
                        $tagCollection = $request->user()->tags()->create([
                            'name' => $tag['name'],
                            'tag_group_id' => $newGroup->id
                        ]);
                    }

                }
            }


        }

    }


    public function destroy(Request $request) {
        abort_if(!$request->user(), 401, 'Not authorised');
    }
}
