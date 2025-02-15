<?php

namespace App\Models;

use App\Models\BacktestingGroup;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Backtest extends Model
{
    use HasUuids;
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name'
    ];


    public function group() : BelongsTo
    {
        return $this->belongsTo(BacktestingGroup::class, 'backtesting_group_id');
    }


    public function trades() :  HasMany
    {
        return $this->hasMany(BacktestTrade::class);
    }
}
