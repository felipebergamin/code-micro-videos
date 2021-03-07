<?php

namespace Tests\Unit;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\CastMember;
use App\Models\Traits\Uuid;
use Tests\TestCase;

class CastMemberUnitTest extends TestCase
{
  /** @var CastMember */
  private $castMember;

  protected function setUp(): void
  {
    parent::setUp();
    $this->castMember = new CastMember();
  }

  public function testFillable()
  {
    $fillable = ['name', 'type'];
    $this->assertEquals(
      $fillable,
      $this->castMember->getFillable(),
    );
  }

  public function testIfUseTraits()
  {
    $traits = [
      HasFactory::class,
      SoftDeletes::class,
      Uuid::class,
    ];
    $castMemberTraits = array_keys(class_uses(CastMember::class));
    ($castMemberTraits);
    $this->assertEquals($traits, $castMemberTraits);
  }

  public function testDatesAttribute()
  {
    $dates = ['deleted_at', 'updated_at', 'created_at'];
    $this->assertEqualsCanonicalizing($dates, $this->castMember->getDates());
    $this->assertCount(count($dates), $this->castMember->getDates());
  }

  public function testCastsAttribute()
  {
    $casts = ['id' => 'string', 'deleted_at' => 'datetime'];
    $this->assertEqualsCanonicalizing($casts, $this->castMember->getCasts());
  }

  public function testIncrementing()
  {
    $this->assertEquals($this->castMember->incrementing, false);
  }
}
