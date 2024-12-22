<?php

namespace App\Models;

use App\Models\User;
use App\Models\Accounts;
use App\Models\DateUnix;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Trade extends Model
{
    use HasUuids;


    protected $guarded = [];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'id'
    ];

    public function dateUnix(): BelongsTo
    {
        return $this->belongsTo(DateUnix::class);
    }


    public function account(): BelongsTo
    {
        return $this->belongsTo(Accounts::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
