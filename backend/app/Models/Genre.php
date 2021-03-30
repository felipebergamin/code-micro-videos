<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Genre extends Model
{
  use HasFactory, SoftDeletes, Traits\Uuid;

  public $incrementing = false;
  protected $fillable = ['name', 'is_active'];
  protected $dates = ['deleted_at', 'created_at', 'updated_at'];
  protected $casts = [
    'id' => 'string',
    'is_active' => 'boolean'
  ];

  public function categories()
  {
    return $this->belongsToMany(Category::class)->withTrashed();
  }
}