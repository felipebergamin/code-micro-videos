<?php

namespace App\Http\Controllers;

use App\Http\Resources\CastMemberResource;
use App\Models\CastMember;

class CastMemberController extends BasicCrudController
{
  private $rules;

  public function __construct()
  {
    $this->rules = [
      'name' => 'required',
      'type' => 'required|in:' . implode(',', CastMember::TYPES)
    ];
  }

  public function model()
  {
    return CastMember::class;
  }

  public function rulesStore()
  {
    return $this->rules;
  }

  public function rulesUpdate()
  {
    return $this->rules;
  }

  protected function resourceCollection()
  {
    return $this->resource();
  }

  protected function resource()
  {
    return CastMemberResource::class;
  }
}
