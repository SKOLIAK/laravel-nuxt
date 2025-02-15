<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use App\Http\Resources\BacktestResource;
use Illuminate\Http\Resources\Json\JsonResource;

class BacktestFolderResource extends JsonResource
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
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'backtests' => BacktestResource::collection($this->backtests)

        ];
    }
}
