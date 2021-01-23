<?php

namespace Tests\Unit;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Category;
use App\Models\Traits\Uuid;
use PHPUnit\Framework\TestCase;

class CategoryTest extends TestCase
{
  private $category;

  protected function setUp(): void
  {
    parent::setUp();
    $this->category = new Category();
  }

  /**
   * A basic unit test example.
   *
   * @return void
   */
  public function testFillable()
  {
    $fillable = ['name', 'description', 'is_active'];
    $this->assertEquals(
      $fillable,
      $this->category->getFillable(),
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
    foreach ($dates as $date) {
      $this->assertContains($date, $this->category->getDates());
    }
    $this->assertCount(count($dates), $this->category->getDates());
  }

  public function testCastsAttribute()
  {
    $casts = ['id' => 'string', 'deleted_at' => 'datetime'];
    $this->assertEquals($casts, $this->category->getCasts());
  }

  public function testIncrementing()
  {
    $this->assertEquals($this->category->incrementing, false);
  }
}
