<?php

namespace App\Models;

use App\Models\Tag;
use App\Models\Trade;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class DateUnix extends Model
{
    use HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'date_unix',
        'rating'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function trades(): HasMany
    {
        return $this->hasMany(Trade::class);
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'date_unix_tags');
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

