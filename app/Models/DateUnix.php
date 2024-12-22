<?php

namespace App\Models;

use App\Models\Trade;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class DateUnix extends Model
{
    use HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'date_unix'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function trades(): HasMany
    {
        return $this->hasMany(Trade::class);
    }

    // public function blotter(): HasMany
    // {
    //     return $this->hasMany(Blotter::class);
    // }

    // public function pnl(): HasMany
    // {
    //     return $this->hasMany(Pnl::class);
    // }
}

