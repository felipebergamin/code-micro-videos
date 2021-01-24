<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Models\Category;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class CategoryControllerTest extends TestCase
{
  use DatabaseMigrations;

  public function testIndex()
  {
    /** @var Category $category */
    $category = Category::factory()->create();
    $response = $this->get(route('categories.index'));
    $response->assertStatus(200)->assertJson([$category->toJson()]);
  }

  public function testShow()
  {
    /** @var Category $category */
    $category = Category::factory()->create();
    $response = $this->get(route('categories.show', ['category' => $category->id]));

    $response->assertStatus(200)->assertJson($category->toArray());
  }
}
