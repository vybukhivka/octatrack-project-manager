<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PartLayout extends Model
{
    use HasFactory;

    protected $fillable = ['part_index', 'label'];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
