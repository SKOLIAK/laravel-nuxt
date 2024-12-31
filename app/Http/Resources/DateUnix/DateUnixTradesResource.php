<?php

namespace App\Http\Resources\DateUnix;

use Illuminate\Http\Request;
use App\Http\Resources\TradeResource;
use Illuminate\Http\Resources\Json\JsonResource;

class DateUnixTradesResource extends JsonResource
{
    public $preserveKeys = true;
    public static $wrap = null;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request)
    {
        // return $this->id = [
        //     'test' => true
        // ];


        return [
            $this->date_unix => [
                'trades' => TradeResource::collection($this->trades)
            ]
        ];
    }
}
