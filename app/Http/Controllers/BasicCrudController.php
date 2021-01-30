<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

abstract class BasicCrudController extends Controller
{
  protected abstract function model();

  protected abstract function rulesStore();

  protected abstract function rulesUpdate();

  public function index()
  {
    return $this->model()::all();
  }

  public function store(Request $request)
  {
    $validData = $this->validate($request, $this->rulesStore());
    $obj = $this->model()::create($validData);
    $obj->refresh();
    return $obj;
  }

  protected function findOrFail($id)
  {
    $model = $this->model();
    $keyName = (new $model)->getRouteKeyName();
    return $this->model()::where($keyName, $id)->firstOrFail();
  }

  public function show($id)
  {
    return $this->findOrFail($id);
  }

  public function update(Request $request, $id)
  {
    $obj = $this->findOrFail($id);
    $validData = $this->validate($request, $this->rulesUpdate());
    $obj->update($validData);
    return $obj;
  }

  public function destroy($id)
  {
    $this->findOrFail($id)->delete();
    return response()->noContent();
  }
}
