<?php

namespace App\Http\Controllers;

use App\Models\Flow;
use Illuminate\Http\Request;
use App\Http\Resources\FlowResource;

class FlowController extends Controller
{
    public function index(Request $request)
    {  
        return new FlowResource($request->user()->flow);
    }

    public function update(Request $request)
    {
        abort_if(!isset($request['edges']) || !isset($request['nodes']), 422, 'Something went wrong');
        if(!$request->user()->flow) {
            $request->user()->flow()->create([
                'edges' => $request['edges'],
                'nodes' => $request['nodes']
            ]);
        } else {
            $request->user()->flow()->update([
                'edges' => $request['edges'],
                'nodes' => $request['nodes']
            ]);
        }

        return response()->json([
            'status' => 'ok',
            'message' => 'Flow data has been saved'
        ]);
    }
}
