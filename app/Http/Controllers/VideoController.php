<?php

namespace App\Http\Controllers;

use App\Models\Video;
use Exception;
use Illuminate\Http\Request;

class VideoController extends BasicCrudController
{
  private $rules;

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
      'genres_id' => 'required|array|exists:genres,id,deleted_at,NULL'
    ];
  }

  public function store(Request $request)
  {
    $validData = $this->validate($request, $this->rulesStore());
    $self = $this;
    $video = \DB::transaction(function () use ($request, $validData, $self) {
      /** @var Video */
      $obj = $this->model()::create($validData);
      $self->handleRelations($obj, $request);
      return $obj;
    });
    $video->refresh();
    return $video;
  }

  public function update(Request $request, $id)
  {
    /** @var Video */
    $obj = $this->findOrFail($id);
    $validData = $this->validate($request, $this->rulesUpdate());

    $self = $this;
    $video = \DB::transaction(function () use ($request, $validData, $obj, $self) {
      $obj->update($validData);
      $self->handleRelations($obj, $request);
      return $obj;
    });
    return $video;
  }

  protected function handleRelations($video, Request $request)
  {
    $video->categories()->sync($request->get('categories_id'));
    $video->genres()->sync($request->get('genres_id'));
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
}
