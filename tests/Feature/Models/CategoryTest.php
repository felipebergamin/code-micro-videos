<?php

namespace Tests\Feature\Models;

use App\Models\Category;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class CategoryTest extends TestCase
{
  use DatabaseMigrations;

  public function testList()
  {
    Category::factory(1)->create();
    $categories = Category::all();
    $this->assertCount(1, $categories);
    $categoryKey = array_keys($categories->first()->getAttributes());
    $this->assertEqualsCanonicalizing(
      [
        'id',
        'name',
        'description',
        'is_active',
        'created_at',
        'updated_at',
        'deleted_at',
      ],
      $categoryKey
    );
  }

  public function testCreate()
  {
    $category = Category::create([
      'name' => 'test1',
    ]);
    $category->refresh();
    $this->assertEquals('test1', $category->name);
    $this->assertNull($category->description);
    $this->assertTrue($category->is_active);

    $category = Category::create([
      'name' => 'test1',
      'description' => null,
    ]);
    $this->assertNull($category->description);

    $category = Category::create([
      'name' => 'test1',
      'description' => 'test description',
    ]);
    $this->assertEquals('test description', $category->description);

    $category = Category::create([
      'name' => 'test1',
      'is_active' => false,
    ]);
    $this->assertFalse($category->is_active);

    $category = Category::create([
      'name' => 'test1',
      'is_active' => true,
    ]);
    $this->assertTrue($category->is_active);

    $category = Category::create([
      'name' => 'test',
    ])->first();
    $this->assertMatchesRegularExpression(
      "/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i",
      $category->id,
    );
  }

  public function testUpdate()
  {
    /** @var Category $category */
    $category = Category::factory()->create([
      'description' => 'test description 1',
      'is_active' => false,
    ])->first();
    $data = [
      'name' => 'test name updated',
      'description' => 'test description updated',
      'is_active' => true,
    ];
    $category->update($data);

    foreach ($data as $key => $value) {
      $this->assertEquals($value, $category->{$key});
    }
  }
}
