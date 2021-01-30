<?php

namespace Tests\Unit;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Category;
use App\Models\Traits\Uuid;
use PHPUnit\Framework\TestCase;

class CategoryUnitTest extends TestCase
{
  /** @var Category $category */
  private $category;

  protected function setUp(): void
  {
    parent::setUp();
    $this->category = new Category();
  }

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
    $this->assertEqualsCanonicalizing($dates, $this->category->getDates());
    $this->assertCount(count($dates), $this->category->getDates());
  }

  public function testCastsAttribute()
  {
    $casts = ['id' => 'string', 'deleted_at' => 'datetime', 'is_active' => 'boolean'];
    $this->assertEqualsCanonicalizing($casts, $this->category->getCasts());
  }

  public function testIncrementing()
  {
    $this->assertEquals($this->category->incrementing, false);
  }
}
