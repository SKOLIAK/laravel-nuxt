<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TradeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->identifier,
            //'dateUnix' => $this->dateUnix->date_unix,
            'symbol' => $this->symbol,
            'symbolOriginal' => $this->symbolOriginal,
            'td' => $this->td,
            'entryTime' => $this->entryTime,
            'entryPrice' => $this->entryPrice,
            'exitTime' => $this->exitTime,
            'exitPrice' => $this->exitPrice,
            'strategy' => $this->strategy,
            'side' => $this->side,
            'buyQuantity' => $this->buyQuantity,
            'sellQuantity' => $this->sellQuantity,

            'commissionOpen' => $this->commissionOpen,
            'commission' => $this->commission,
            'grossEntryProceedsOpen' => $this->grossEntryProceedsOpen,
            'grossEntryProceeds' => $this->grossEntryProceeds,
            'grossExitProceedsOpen' => $this->grossExitProceedsOpen,
            'grossExitProceeds' => $this->grossExitProceeds,
            'grossProceedsOpen' => $this->grossProceedsOpen,
            'grossProceeds' => $this->grossProceeds,
            'grossWins' => $this->grossWins,
            'grossLoss' => $this->grossLoss,
            'grossSharePL' => $this->grossSharePL,
            'grossSharePLWins' => $this->grossSharePLWins,
            'grossSharePLLoss' => $this->grossSharePLLoss,
            'grossStatus' => $this->grossStatus,
            'netEntryProceedsOpen' => $this->netEntryProceedsOpen,
            'netEntryProceeds' => $this->netEntryProceeds,
            'netExitProceedsOpen' => $this->netExitProceedsOpen,
            'netExitProceeds' => $this->netExitProceeds,
            'netProceedsOpen' => $this->netProceedsOpen,
            'netProceeds' => $this->netProceeds,
            'netWins' => $this->netWins,
            'netLoss' => $this->netLoss,
            'netSharePL' => $this->netSharePL,
            'netSharePLWins' => $this->netSharePLWins,
            'netSharePLLoss' => $this->netSharePLLoss,
            'netStatus' => $this->netStatus,
            'executionsCount' => $this->executionsCount,
            'tradesCount' => $this->tradesCount,
            'grossWinsQuantity' => $this->grossWinsQuantity,
            'grossLossQuantity' => $this->grossLossQuantity,
            'grossWinsCount' => $this->grossWinsCount,
            'grossLossCount' => $this->grossLossCount,
            'netWinsQuantity' => $this->netWinsQuantity,
            'netLossQuantity' => $this->netLossQuantity,
            'netWinsCount' => $this->netWinsCount,
            'netLossCount' => $this->netLossCount,

            'currency' => $this->currency,
            'note' => $this->note,
            'account' => new TradeAccountResource($this->account),
            'ratings' => [
                'preparation' => $this->rating->preparation ?? 0,
                'entry' => $this->rating->entry ?? 0,
                'stop_loss' => $this->rating->stop_loss ?? 0,
                'target' => $this->rating->target ?? 0,
                'management' => $this->rating->management ?? 0,
                'rules' => $this->rating->rules ?? 0,
                'average' => $this->rating ? $this->rating->getAverage() : 0
            ]
        ];
    }
}
