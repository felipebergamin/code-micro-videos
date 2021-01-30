<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Models\Genre;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;
use Tests\Traits\TestSaves;
use Tests\Traits\TestValidations;

class GenreControllerTest extends TestCase
{
  use DatabaseMigrations, TestValidations, TestSaves;

  /** @var Genre */
  private $genre;

  protected function setUp(): void
  {
    parent::setUp();
    $this->genre = Genre::factory()->create();
  }

  public function testIndex()
  {
    $response = $this->get(route('genres.index'));
    $response->assertStatus(200)->assertJson([$this->genre->toArray()]);
  }

  public function testShow()
  {
    $response = $this->get(route('genres.show', ['genre' => $this->genre->id]));
    $response->assertStatus(200)->assertJson($this->genre->toArray());
  }

  public function testStore()
  {
    $data = ['name' => 'test'];
    $this->assertStore($data, $data + ['is_active' => true, 'deleted_at' => null]);

    $data = [
      'name' => 'test',
      'is_active' => false
    ];
    $this
      ->assertStore(
        $data,
        $data + ['is_active' => false, 'deleted_at' => null]
      )
      ->assertJsonStructure([
        'created_at', 'updated_at'
      ]);
  }

  public function testUpdate()
  {
    $this->genre = Genre::factory()->create([
      'name' => 'genre name',
      'is_active' => false,
    ]);
    $data = [
      'name' => 'test',
      'is_active' => true,
    ];
    $this
      ->assertUpdate($data, $data + ['deleted_at' => null])
      ->assertJsonStructure([
        'created_at', 'updated_at'
      ]);
  }

  public function testValidationData()
  {
    $data = ['name' => ''];
    $this->assertInvalidationInStoreAction($data, 'required');
    $this->assertInvalidationInUpdateAction($data, 'required');

    $data = ['name' => str_repeat('a', 256)];
    $this->assertInvalidationInStoreAction($data, 'max.string', ['max' => 255]);
    $this->assertInvalidationInUpdateAction($data, 'max.string', ['max' => 255]);

    $data = ['is_active' => 'a'];
    $this->assertInvalidationInStoreAction($data, 'boolean');
    $this->assertInvalidationInUpdateAction($data, 'boolean');
  }

  public function testDelete()
  {
    $this->json('DELETE', $this->routeDelete());
    $this->assertNull(Genre::find($this->genre->id));
    $this->assertNotNull(Genre::withTrashed()->find($this->genre->id));
  }

  protected function routeStore()
  {
    return route('genres.store');
  }

  protected function routeUpdate()
  {
    return route('genres.update', ['genre' => $this->genre->id]);
  }

  protected function routeDelete()
  {
    return route('genres.destroy', ['genre' => $this->genre->id]);
  }

  protected function model()
  {
    return Genre::class;
  }
}
