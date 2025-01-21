<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ScreenshotController extends Controller
{
    public function delete(Request $request) {
        $user = $request->user();
        abort_if(!$user, 400);

        $screenshot = $user->screenshots()->where('id', request('screenshot'))->first();
        $file = '';
        if ($screenshot) {
            Storage::disk('public')->delete($screenshot->file);
            $file = str_replace("\\", "", $screenshot->file);
            $screenshot->delete();
        }

        return response()->json([
            'status' => 'ok',
            'data' => $file
        ]);
    }
}
