<?php

namespace Tests\Stubs\Controllers;

use App\Http\Controllers\BasicCrudController;
use Tests\Stubs\Models\CategoryStub;

class CategoryControllerStub extends BasicCrudController
{
  public function model()
  {
    return CategoryStub::class;
  }

  public function routeStore()
  {
  }

  public function routeUpdate()
  {
  }
}
