<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Trade;
use App\Models\Rating;
use App\Models\Accounts;
use Illuminate\Http\Request;
use App\Http\Resources\TradeResource;
use App\Http\Resources\DateUnix\DateUnixTradesResource;

class RatingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = User::first();
        $id = '9dd99f98-6023-4416-953f-3b367c6a4fd8';

        return DateUnixTradesResource::collection(
            $user->dateUnix()->whereHas('trades', function($q) {
                $q->whereHas('rating');
            })->get()
        );





        return TradeResource::collection($user->trades()->whereHas('rating', function($q){
            // $q->where('preparation', '>', 0);
            // $q->where('entry', '>', 0);
            // $q->where('stop_loss', '>', 0);
            // $q->where('management', '>', 0);
            // $q->where('rules', '>', 0);
         })->get());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Rating $rating)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Rating $rating)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Rating $rating)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Rating $rating)
    {
        //
    }
}
