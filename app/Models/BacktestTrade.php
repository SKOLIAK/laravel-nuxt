<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class BacktestTrade extends Model
{
    use HasUuids;
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'identifier', 'strategy', 'symbol', 'symbol_tw', 'symbolOriginal', 'entryTime', 'exitTime',
        'day_of_week', 'session', 'entry', 'target', 'stop', 'quantity', 'outcome', 'rrr', 'netProceeds', 'gain',
        'timeframe'
    ];
}
