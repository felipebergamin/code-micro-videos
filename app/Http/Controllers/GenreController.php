<?php

namespace App\Http\Controllers;

use App\Http\Resources\GenreResource;
use App\Models\Genre;
use Illuminate\Http\Request;

class GenreController extends BasicCrudController
{
  private $rules = [
    'name' => 'required|max:255',
    'is_active' => 'boolean',
    'categories_id' => 'required|array|exists:categories,id,deleted_at,NULL'
  ];

  public function store(Request $request)
  {
    $validData = $this->validate($request, $this->rulesStore());
    $self = $this;
    $genre = \DB::transaction(function () use ($request, $validData, $self) {
      /** @var Video */
      $obj = $this->model()::create($validData);
      $self->handleRelations($obj, $request);
      return $obj;
    });
    $genre->refresh();
    return new GenreResource($genre);
  }

  public function update(Request $request, $id)
  {
    /** @var Genre */
    $obj = $this->findOrFail($id);
    $validData = $this->validate($request, $this->rulesUpdate());

    $self = $this;
    $genre = \DB::transaction(function () use ($request, $validData, $obj, $self) {
      $obj->update($validData);
      $self->handleRelations($obj, $request);
      return $obj;
    });
    return new GenreResource($genre);
  }

  protected function handleRelations($genre, Request $request)
  {
    $genre->categories()->sync($request->get('categories_id'));
  }

  protected function model()
  {
    return Genre::class;
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
    return GenreResource::class;
  }
}
