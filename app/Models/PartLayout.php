<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PartLayout extends Model
{
    protected $fillable = ['project_id', 'part_index', 'label'];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
