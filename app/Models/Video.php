<?php

namespace App\Models;

use App\Models\Traits\UploadFiles;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use \DB;

class Video extends Model
{
  use HasFactory, Traits\Uuid, SoftDeletes, UploadFiles;

  const RATING_LIST = ['L', '10', '12', '14', '16', '18'];

  protected $fillable = [
    'title',
    'description',
    'year_launched',
    'opened',
    'rating',
    'duration',
    'video_file',
    'thumb_file'
  ];

  protected $dates = ['deleted_at'];

  protected $casts = [
    'id' => 'string',
    'opened' => 'boolean',
    'year_launched' => 'integer',
    'duration' => 'integer'
  ];

  public $incrementing = false;
  public static $fileFields = ['video_file', 'thumb_file'];

  public static function create(array $attributes = [])
  {
    $files = self::extractFiles($attributes);
    try {
      DB::beginTransaction();
      /** @var Video $obj */
      $obj = static::query()->create($attributes);
      static::handleRelations($obj, $attributes);
      $obj->uploadFiles($files);
      DB::commit();
      return $obj;
    } catch (\Exception $e) {
      if (isset($obj)) {
        $obj->deleteFiles($files);
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
      static::handleRelations($this, $attributes);
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

  public static function handleRelations(Video $video, array $attributes)
  {
    if (isset($attributes['categories_id'])) {
      $video->categories()->sync($attributes['categories_id']);
    }
    if (isset($attributes['genres_id'])) {
      $video->genres()->sync($attributes['genres_id']);
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

  protected function uploadDir()
  {
    return $this->id;
  }
}
