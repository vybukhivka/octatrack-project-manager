<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
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
            'title' => $this->title,
            'status' => $this->status,
            'genre' => $this->genre,
            'number_of_tracks' => $this->number_of_tracks,
            'duration_minutes' => $this->duration_minutes,
            'is_done' => (bool) $this->is_done,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,

            'tracks' => $this->whenLoaded('trackLayout'),
            'parts' => $this->whenLoaded('partLayout'),
            'scenes' => $this->whenLoaded('sceneLayout'),
        ];
    }
}
