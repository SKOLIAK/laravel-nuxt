<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FlowResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'edges' => $this->edges ? json_decode($this->edges) : json_decode('{}'),
            'nodes' => $this->nodes ? json_decode($this->nodes, true) : json_decode('{}')
        ];
    }
}
