<?php

namespace App\Models;

use App\Models\TagGroup;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Tag extends Model
{
    use HasUuids;

    public $timestamps = false;

    protected $fillable = ['name', 'tag_group_id'];

    public function group() : BelongsTo
    {
        return $this->belongsTo(TagGroup::class, 'tag_group_id');
    }
}
