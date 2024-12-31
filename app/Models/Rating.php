<?php

namespace App\Models;

use App\Models\User;
use App\Models\Trade;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Rating extends Model
{
    use HasUuids;

    protected $fillable = [
        'preparation',
        'entry',
        'stop_loss',
        'target',
        'management',
        'rules'
    ];

    public function trade(): BelongsTo
    {
        return $this->belongsTo(Trade::class);
    }

    public function getAverage() {
        $preparation = $this->preparation ?? 0;
        $entry = $this->entry ?? 0;
        $stop_loss = $this->stop_loss ?? 0;
        $target = $this->target ?? 0;
        $management = $this->management ?? 0;
        $rules = $this->rules ?? 0;

        return round(($preparation + $entry + $stop_loss + $target + $management + $rules) / 6, 2);
    }

}
