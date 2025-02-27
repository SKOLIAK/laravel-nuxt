<?php

namespace App\Http\Controllers;

use stdClass;
use App\Models\User;
use Illuminate\Http\Request;
use App\Models\BacktestingGroup;
use App\Http\Resources\Backtesting\FolderResource;
use App\Http\Resources\BacktestFolderResource;

class BacktestingGroupController extends Controller
{

    public function index(Request $request) {
        $user = $request->user();
        abort_if(!$user, 403);

        return BacktestFolderResource::collection($user->backtestingGroups);
    }


    /** Create or update existing backtesting folder */
    public function add(Request $request) {
        $user = $request->user();
        abort_if(!$user, 403);

        $request->validate([
            'name' => ['required', 'string'],
            'color' => ['required']
        ]);

        $response = [
            'status' => 'ok',
            'message' => '',
            'data' => new stdClass()
        ];

        $success = false;

        // No ID has been passed, meaning we're creating a new Folder
        if(! $request->id) {
        
            $success = $response['data'] = $user->backtestingGroups()->create([
                'name' => $request->name,
                'color' => $request->color
            ]);

        }

        if( $request->id) {
            $response['data'] = $user->backtestingGroups()->where('id', $request->id)->first();
            $success = $response['data']->update([
                'name' => $request->name,
                'color' => $request->color
            ]);
        }

        $response['data'] = new FolderResource($response['data']);

        $response['message'] = sprintf('Folder `%s` has been %s', $response['data']->name, $request->id ? 'updated' : 'created');
        return response()->json($response);

    }

    public function delete(Request $request) {

        $user = $request->user();
        abort_if(!$user || !$request['id'], 403);

        $group = $user->backtestingGroups()->where('id', $request['id'])->delete();

        return response()->json([
            'status' => 'ok',
            'message' =>'Folder has been deleted'
        ]);
    }

}
