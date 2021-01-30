<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends BasicCrudController
{
  private $rules = [
    'name' => 'required|max:255',
    'is_active' => 'boolean',
    'description' => 'nullable'
  ];

  protected function model()
  {
    return Category::class;
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
