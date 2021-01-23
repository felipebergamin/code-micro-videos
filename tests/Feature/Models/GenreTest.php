<?php

namespace Tests\Feature\Models;

use App\Models\Genre;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class GenreTest extends TestCase
{
  use DatabaseMigrations;

  /** @var Genre $genre */
  private $genre;


  public function testList()
  {
    Genre::factory(1)->create();
    $genres = Genre::all();
    $this->assertCount(1, $genres);
    $genreKeys = array_keys($genres->first()->getAttributes());
    $this->assertEqualsCanonicalizing(
      [
        'id',
        'name',
        'is_active',
        'created_at',
        'updated_at',
        'deleted_at',
      ],
      $genreKeys
    );
  }

  public function testCreate()
  {
    $genre = Genre::create([
      'name' => 'genre1',
    ]);
    $genre->refresh();
    $this->assertEquals('genre1', $genre->name);
    $this->assertTrue($genre->is_active);

    $genre = Genre::create([
      'name' => 'test1',
      'is_active' => false,
    ]);
    $this->assertFalse($genre->is_active);

    $genre = Genre::create([
      'name' => 'test1',
      'is_active' => true,
    ]);
    $this->assertTrue($genre->is_active);

    $genre = Genre::create([
      'name' => 'test',
    ])->first();
    $this->assertMatchesRegularExpression(
      "/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i",
      $genre->id,
    );
  }

  public function testUpdate()
  {
    /** @var Genre $genre */
    $genre = Genre::factory()->create([
      'name' => 'movie_genre',
      'is_active' => false,
    ])->first();
    $data = [
      'name' => 'updated genre name',
      'is_active' => true,
    ];
    $genre->update($data);

    foreach ($data as $key => $value) {
      $this->assertEquals($value, $genre->{$key});
    }
  }

  public function testDeletion()
  {
    $genre = Genre::create([
      'name' => 'genre name'
    ]);
    $genre->delete();
    $this->assertCount(0, Genre::all());
  }
}
