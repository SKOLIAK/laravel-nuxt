<?php

namespace App\Models;

use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TagGroup extends Model
{
    use HasUuids;

    protected $fillable = ['name', 'color'];

    public $timestamps = false;

    public function tags() :  HasMany
    {
        return $this->hasMany(Tag::class);
    }

    public function user() : BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
