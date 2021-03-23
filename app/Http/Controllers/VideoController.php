<?php

namespace App\Http\Controllers;

use App\Http\Resources\VideoResource;
use App\Models\Video;
use App\Rules\GenresHasCategoriesRule;
use Illuminate\Http\Request;

class VideoController extends BasicCrudController
{
  private $rules;
  const MAX_FILE_SIZE = 100000;

  public function __construct()
  {
    $this->rules = [
      'title' => 'required|max:255',
      'description' => 'required',
      'year_launched' => 'required|date_format:Y',
      'opened' => 'boolean',
      'rating' => 'required|in:' . implode(',', Video::RATING_LIST),
      'duration' => 'required|integer',
      'categories_id' => 'required|array|exists:categories,id,deleted_at,NULL',
      'genres_id' => ['required', 'array', 'exists:genres,id,deleted_at,NULL'],
      'video_file' => "file|mimetypes:video/mp4|max:" . Video::VIDEO_FILE_MAX_SIZE,
      'thumb_file' => 'image|max:' . Video::THUMB_FILE_MAX_SIZE,
      'banner_file' => "image|max:" . Video::BANNER_FILE_MAX_SIZE,
      'trailer_file' => "file|mimetypes:video/mp4|max:" . Video::TRAILER_FILE_MAX_SIZE,
    ];
  }

  public function store(Request $request)
  {
    $this->addRuleIfGenreHasCategories($request);
    $validData = $this->validate($request, $this->rulesStore());
    $video = $this->model()::create($validData);
    $video->refresh();
    return new VideoResource($video);
  }

  public function update(Request $request, $id)
  {
    /** @var Video */
    $obj = $this->findOrFail($id);
    $this->addRuleIfGenreHasCategories($request);
    $validData = $this->validate($request, $this->rulesUpdate());
    $obj->update($validData);
    return new VideoResource($obj);
  }

  protected function addRuleIfGenreHasCategories(Request $request)
  {
    $categoriesId = $request->get('categories_id');
    $categoriesId = is_array($categoriesId) ? $categoriesId : [];
    $this->rules['genres_id'][] = new GenresHasCategoriesRule($request->get('categories_id'));
  }

  protected function model()
  {
    return Video::class;
  }

  protected function rulesStore()
  {
    return $this->rules;
  }

  protected function rulesUpdate()
  {
    return $this->rules;
  }

  protected function resourceCollection()
  {
    return $this->resource();
  }

  protected function resource()
  {
    return VideoResource::class;
  }
}
