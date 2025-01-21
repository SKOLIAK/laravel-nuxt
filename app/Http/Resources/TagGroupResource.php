<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use App\Http\Resources\TagResource;
use Illuminate\Http\Resources\Json\JsonResource;

class TagGroupResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'color' => $this->color,
            'tags' => TagResource::collection($this->tags)
        ];
    }
}
