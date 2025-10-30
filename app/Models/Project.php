<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'number_of_tracks',
        'status',
        'genre',
        'duration_minutes',
        'is_done',
    ];

    public function trackLayout(): HasMany
    {
        return $this->hasMany(TrackLayout::class);
    }

    public function sceneLayout(): HasMany
    {
        return $this->hasMany(SceneLayout::class);
    }

    public function partLayout(): HasMany
    {
        return $this->hasMany(PartLayout::class);
    }
}
