<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MiniAudit extends Model
{
    protected $fillable = [
        'nama',
        'email',
        'whatsapp',
        'website',
        'traffic',
        'omzet',
        'budget_iklan',
        'tantangan',
        'tantangan_lainnya',
        'is_qualified',
    ];

    protected $casts = [
        'is_qualified' => 'boolean',
    ];
}
