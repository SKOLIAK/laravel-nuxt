<?php

namespace App\Models;

use App\Models\User;
use App\Models\Trade;
use App\Models\Rating;
use App\Models\Accounts;
use App\Models\DateUnix;
use App\Models\Screenshot;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

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

    protected $casts = [
        'td' => 'integer',
        'buyQuantity' => 'integer',
        'sellQuantity' => 'integer',
        'entryTime' => 'integer',
        'exitTime' => 'integer',
        'entryPrice' => 'float',
        'exitPrice' => 'float',
        'commissionOpen' => 'float',
        'grossEntryProceedsOpen' => 'float',
        'grossEntryProceeds' => 'float',
        'grossExitProceedsOpen' => 'float',
        'grossExitProceeds' => 'float',
        'grossProceedsOpen' => 'float',
        'grossProceeds' => 'float',
        'grossWins' => 'int',
        'grossLoss' => 'float',
        'grossSharePL' => 'float',
        'grossSharePLWins' => 'int',
        'grossSharePLLoss' => 'float',
        'netEntryProceedsOpen' => 'float',
        'netEntryProceeds' => 'float',
        'netExitProceedsOpen' => 'float',
        'netExitProceeds' => 'float',
        'netProceedsOpen' => 'float',
        'netProceeds' => 'float',
        'netWins' => 'float',
        'netLoss' => 'float',
        'netSharePL' => 'float',
        'netSharePLWins' => 'float',
        'netSharePLLoss' => 'float',
        'commission' => 'float',
        'executionsCount' => 'int',
        'tradesCount' => 'int',
        'grossWinsQuantity' => 'int',
        'grossLossQuantity' => 'int',
        'grossWinsCount' => 'int',
        'grossLossCount' => 'int',
        'netWinsQuantity' => 'int',
        'netLossQuantity' => 'int',
        'netWinsCount' => 'int',
        'netLossCount' => 'int'

    ];

    public function dateUnix(): BelongsTo
    {
        return $this->belongsTo(DateUnix::class);
    }

    public function account(): BelongsTo
    {
        return $this->belongsTo(Accounts::class, 'accounts_id', 'id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function rating(): HasOne
    {
        return $this->hasOne(Rating::class);
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'trade_tag');
    }

    public function screenshots(): HasMany
    {
        return $this->hasMany(Screenshot::class);
    }
}
