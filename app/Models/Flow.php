<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Flow extends Model
{
    use HasUuids;
    
    public $timestamps = false;

    protected $fillable = ['edges', 'nodes'];

    public function user() : BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
