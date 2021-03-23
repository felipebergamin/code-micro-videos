<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Http\Controllers\GenreController;
use App\Http\Resources\GenreResource;
use App\Models\Category;
use App\Models\Genre;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Http\Request;
use Mockery\MockInterface;
use Tests\Exceptions\TestException;
use Tests\TestCase;
use Tests\Traits\TestResources;
use Tests\Traits\TestSaves;
use Tests\Traits\TestValidations;

class GenreControllerTest extends TestCase
{
  use DatabaseMigrations, TestValidations, TestSaves, TestResources;

  private $serializedFields = ['id', 'name', 'is_active', 'created_at', 'updated_at', 'deleted_at'];

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
    $response
      ->assertStatus(200)
      ->assertJsonStructure([
        'data' => [
          '*' => $this->serializedFields,
        ],
        'meta' => [],
        'links' => [],
      ]);

    $resource = GenreResource::collection(collect([$this->genre]));
    $this->assertResource($response, $resource);
  }

  public function testShow()
  {
    $response = $this->get(route('genres.show', ['genre' => $this->genre->id]));
    $response->assertStatus(200)->assertJsonStructure([
      'data' => $this->serializedFields,
    ]);

    $id = $response->json('data.id');
    $resource = new GenreResource(Genre::find($id));
    $this->assertResource($response, $resource);
  }

  public function testStore()
  {
    /** @var Category */
    $category = Category::factory()->create();
    $data = ['name' => 'test'];
    $response = $this->assertStore($data + ['categories_id' => [$category->id]], $data + ['is_active' => true, 'deleted_at' => null]);
    $response->assertJsonStructure(['data' => $this->serializedFields]);
    $this->assertHasCategory($response->json('data.id'), $category->id);

    $data = [
      'name' => 'test',
      'is_active' => false,
    ];
    $response = $this
      ->assertStore(
        $data + ['categories_id' => [$category->id]],
        $data + ['is_active' => false, 'deleted_at' => null]
      )
      ->assertJsonStructure([
        'data' => $this->serializedFields,
      ]);
    $this->assertHasCategory($response->json('data.id'), $category->id);

    $id = $response->json('data.id');
    $resource = new GenreResource(Genre::find($id));
    $this->assertResource($response, $resource);
  }

  public function testUpdate()
  {
    /** @var Category */
    $category = Category::factory()->create();

    $data = [
      'name' => 'test',
      'is_active' => true,
    ];
    $response = $this
      ->assertUpdate(
        $data + ['categories_id' => [$category->id]],
        $data + ['deleted_at' => null]
      );
    $response->assertJsonStructure([
      'data' => $this->serializedFields,
    ]);
    $this->assertHasCategory($this->genre->id, $category->id);

    $id = $response->json('data.id');
    $resource = new GenreResource(Genre::find($id));
    $this->assertResource($response, $resource);
  }

  public function testRollbackStore()
  {
    /** @var GenreController|MockInterface */
    $controller = $this->mock(GenreController::class)
      ->makePartial()
      ->shouldAllowMockingProtectedMethods();

    $controller
      ->shouldReceive('validate')
      ->andReturn(['name' => 'test']);
    $controller
      ->shouldReceive('rulesStore')
      ->andReturn([]);
    $controller
      ->shouldReceive('handleRelations')
      ->once()
      ->andThrow(new TestException());

    /** @var Request|MockInterface */
    $request = $this->mock(Request::class);
    $request->shouldReceive('all')->andReturn([]);

    $hasError = false;
    try {
      $controller->store($request);
    } catch (TestException $e) {
      $this->assertCount(1, Genre::all());
      $hasError = true;
    }

    $this->assertTrue($hasError);
  }

  public function testRollbackUpdate()
  {
    /** @var GenreController|MockInterface */
    $controller = $this->mock(GenreController::class)
      ->makePartial()
      ->shouldAllowMockingProtectedMethods();

    $controller
      ->shouldReceive('findOrFail')
      ->andReturn($this->genre);
    $controller
      ->shouldReceive('validate')
      ->andReturn(['name' => 'test']);
    $controller
      ->shouldReceive('rulesUpdate')
      ->andReturn([]);
    $controller
      ->shouldReceive('handleRelations')
      ->once()
      ->andThrow(new TestException());

    /** @var Request|MockInterface */
    $request = $this->mock(Request::class);

    $hasError = false;
    try {
      $controller->update($request, 1);
    } catch (TestException $e) {
      $this->assertCount(1, Genre::all());
      $hasError = true;
    }

    $this->assertTrue($hasError);
  }

  protected function assertHasCategory($genreId, $categoryId)
  {
    $this->assertDatabaseHas('category_genre', [
      'genre_id' => $genreId,
      'category_id' => $categoryId
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

    $data = ['categories_id' => 'a'];
    $this->assertInvalidationInStoreAction($data, 'array');
    $this->assertInvalidationInUpdateAction($data, 'array');

    $data = ['categories_id' => [100]];
    $this->assertInvalidationInStoreAction($data, 'in');
    $this->assertInvalidationInUpdateAction($data, 'in');

    /** @var Category */
    $category = Category::factory()->create();
    $category->delete();
    $data = ['categories_id' => [$category->id]];
    $this->assertInvalidationInStoreAction($data, 'exists');
    $this->assertInvalidationInUpdateAction($data, 'exists');
  }

  public function testDelete()
  {
    $this->json('DELETE', $this->routeDelete());
    $this->assertNull(Genre::find($this->genre->id));
    $this->assertNotNull(Genre::withTrashed()->find($this->genre->id));
  }

  public function testSyncCategories()
  {
    $categoriesId = Category::factory(3)->create()->pluck('id')->toArray();

    $sendData = [
      'name' => 'test',
      'categories_id' => [$categoriesId[0]],
    ];
    $response = $this->json('POST', $this->routeStore(), $sendData);
    $this->assertDatabaseHas('category_genre', [
      'category_id' => $categoriesId[0],
      'genre_id' => $response->json('data.id'),
    ]);

    $sendData = [
      'name' => 'test',
      'categories_id' => [$categoriesId[1], $categoriesId[2]],
    ];
    $response = $this->json('PUT', route('genres.update', ['genre' => $response->json('data.id')]), $sendData);
    $this->assertDatabaseMissing('category_genre', [
      'category_id' => $categoriesId[0],
      'genre_id' => $response->json('data.id'),
    ]);
    $this->assertDatabaseHas('category_genre', [
      'category_id' => $categoriesId[1],
      'genre_id' => $response->json('data.id'),
    ]);
    $this->assertDatabaseHas('category_genre', [
      'category_id' => $categoriesId[2],
      'genre_id' => $response->json('data.id'),
    ]);
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
