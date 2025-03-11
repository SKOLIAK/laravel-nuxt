<?php
namespace App\Http\Resources\Backtesting;

use Illuminate\Http\Request;
use App\Http\Resources\BacktestResource;
use Illuminate\Http\Resources\Json\JsonResource;

class FolderResource extends JsonResource
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
            'backtests' => BacktestResource::collection($this->backtests)
        ];
    }
}

