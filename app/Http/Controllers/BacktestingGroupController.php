<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BacktestingGroup;

class BacktestingGroupController extends Controller
{

    public function index(Request $request) {
        $user = $request->user();
        abort_if(!$user, 403);
        return $user->backtestingGroups()->get()->toArray();
    }

    public function add(Request $request) {
        $request->validate([
            'name' => ['required', 'string'],
            'color' => ['required']
        ]);

        $user = $request->user();
        abort_if(!$user, 403, 'Not authorised');


        /** We're editing a group */
        if (request('id') != null) {
            $group = $user->backtestingGroups()->where('id', request('id'))->update([
                'name' => request('name'),
                'color' => request('color')
            ]);
        } else {
            /** Creating a new group */
            $group = $user->backtestingGroups()->create([
                'name' => request('name'),
                'color' => request('color')
            ]);
        }


        return response()->json([
            'status' => $group ? 'ok' : 'false',
            'message' => $group ? request('id') ? 'Folder has been updated' : 'Folder has been created' : 'Something went wrong'
        ]);
    }

    public function delete(Request $request) {

        $user = $request->user();
        abort_if(!$user, 403);
        abort_if(!$request['id'], 500);

        $group = $user->backtestingGroups()->where('id', $request['id'])->delete();

        return response()->json([
            'status' => 'ok',
            'message' =>'Folder has been deleted'
        ]);
    }

}
