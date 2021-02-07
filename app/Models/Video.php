<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use \DB;

class Video extends Model
{
  use HasFactory, Traits\Uuid, SoftDeletes;

  const RATING_LIST = ['L', '10', '12', '14', '16', '18'];

  protected $fillable = [
    'title',
    'description',
    'year_launched',
    'opened',
    'rating',
    'duration'
  ];

  protected $dates = ['deleted_at'];

  protected $casts = [
    'id' => 'string',
    'opened' => 'boolean',
    'year_launched' => 'integer',
    'duration' => 'integer'
  ];

  public $incrementing = false;

  public static function create(array $attributes = [])
  {
    try {
      DB::beginTransaction();
      $obj = static::query()->create($attributes);
      // TODO: handle the uploads here
      DB::commit();
      return $obj;
    } catch (\Exception $e) {
      if (isset($obj)) {
        // TODO: delete uploaded files
      }
      DB::rollBack();
      throw $e;
    }
  }

  public function update(array $attributes = [], array $options = [])
  {
    try {
      DB::beginTransaction();
      $saved = parent::update($attributes, $options);
      if ($saved) {
        // upload
        // delete old files
      }
      // TODO: handle the uploads here
      DB::commit();
      return $saved;
    } catch (\Exception $e) {
      // TODO: delete uploaded files
      DB::rollBack();
      throw $e;
    }
  }

  public function categories()
  {
    return $this->belongsToMany(Category::class)->withTrashed();
  }

  public function genres()
  {
    return $this->belongsToMany(Genre::class)->withTrashed();
  }
}
