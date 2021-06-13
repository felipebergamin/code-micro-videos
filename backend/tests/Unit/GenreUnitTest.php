<?php

namespace Tests\Unit;

use EloquentFilter\Filterable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Genre;
use App\Models\Traits\Uuid;
use Tests\TestCase;

class GenreUnitTest extends TestCase
{
  /** @var Genre */
  private $genre;

  protected function setUp(): void
  {
    parent::setUp();
    $this->genre = new Genre();
  }

  public function testFillable()
  {
    $fillable = ['name', 'is_active'];
    $this->assertEquals(
      $fillable,
      $this->genre->getFillable(),
    );
  }

  public function testIfUseTraits()
  {
    $traits = [
      HasFactory::class,
      SoftDeletes::class,
      Uuid::class,
      Filterable::class,
    ];
    $genreTraits = array_keys(class_uses(Genre::class));
    $this->assertEquals($traits, $genreTraits);
  }

  public function testDatesAttribute()
  {
    $dates = ['deleted_at', 'updated_at', 'created_at'];
    $this->assertEqualsCanonicalizing($dates, $this->genre->getDates());
    $this->assertCount(count($dates), $this->genre->getDates());
  }

  public function testCastsAttribute()
  {
    $casts = ['id' => 'string', 'deleted_at' => 'datetime', 'is_active' => 'boolean'];
    $this->assertEqualsCanonicalizing($casts, $this->genre->getCasts());
  }

  public function testIncrementing()
  {
    $this->assertEquals($this->genre->incrementing, false);
  }
}
