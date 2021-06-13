<?php

namespace App\Models;

use App\ModelFilters\CastMemberFilter;
use EloquentFilter\Filterable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CastMember extends Model
{
  use HasFactory, SoftDeletes, Traits\Uuid, Filterable;

  const TYPES = ['DIRECTOR' => 1, 'ACTOR' => 2];

  public static $types = [
    CastMember::TYPES['DIRECTOR'],
    CastMember::TYPES['ACTOR'],
  ];

  protected $fillable = ['name', 'type'];

  protected $dates = ['created_at', 'updated_at', 'deleted_at'];

  protected $casts = [
    'id' => 'string'
  ];

  public function modelFilter()
  {
    return $this->provideFilter(CastMemberFilter::class);
  }

  public $incrementing = false;
}
