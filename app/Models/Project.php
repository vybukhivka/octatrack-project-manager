<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'number_of_tracks',
        'genre',
        'duration_minutes',
        'is_done',
    ];

    public function trackLayout(): HasOne
    {
        return $this->hasOne(TrackLayout::class);
    }

    public function sceneLayout(): HasOne
    {
        return $this->hasOne(SceneLayout::class);
    }

    public function partLayout(): HasOne
    {
        return $this->hasOne(PartLayout::class);
    }
}
