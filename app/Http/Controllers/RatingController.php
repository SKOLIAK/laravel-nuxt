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
        abort_if(!$request->user(), 401, 'Not authorised');

        return DateUnixTradesResource::collection(
            $request->user()->dateUnix()->whereHas('trades', function($q) {
                $q->whereHas('rating');
            })->get()
        );
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
