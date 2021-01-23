<?php

namespace Tests\Unit;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Category;
use App\Models\Traits\Uuid;
use PHPUnit\Framework\TestCase;

class CategoryTest extends TestCase
{
  /**
   * A basic unit test example.
   *
   * @return void
   */
  public function testFillable()
  {
    $fillable = ['name', 'description', 'is_active'];
    $category = new Category();
    $this->assertEquals(
      $fillable,
      $category->getFillable(),
    );
  }

  public function testIfUseTraits()
  {
    $traits = [
      HasFactory::class,
      SoftDeletes::class,
      Uuid::class,
    ];
    $categoryTraits = array_keys(class_uses(Category::class));
    ($categoryTraits);
    $this->assertEquals($traits, $categoryTraits);
  }

  public function testDatesAttribute()
  {
    $dates = ['deleted_at', 'updated_at', 'created_at'];
    $category = new Category();
    foreach ($dates as $date) {
      $this->assertContains($date, $category->getDates());
    }
    $this->assertCount(count($dates), $category->getDates());
  }

  public function testCastsAttribute()
  {
    $casts = ['id' => 'string', 'deleted_at' => 'datetime'];
    $category = new Category();
    $this->assertEquals($casts, $category->getCasts());
  }

  public function testIncrementing()
  {
    $category = new Category();
    $this->assertEquals($category->incrementing, false);
  }
}
