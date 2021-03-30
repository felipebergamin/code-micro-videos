<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Http\Resources\CastMemberResource;
use App\Models\CastMember;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;
use Tests\Traits\TestResources;
use Tests\Traits\TestSaves;
use Tests\Traits\TestValidations;

class CastMemberControllerTest extends TestCase
{
  use DatabaseMigrations, TestValidations, TestSaves, TestResources;

  /** @var CastMember */
  private $castMember;

  private $serializedFields = [
    'id',
    'name',
    'type',
    'created_at',
    'updated_at',
    'deleted_at',
  ];

  protected function setUp(): void
  {
    parent::setUp();
    $this->castMember = CastMember::factory()->create();
  }

  public function testIndex()
  {
    $response = $this->get(route('cast_members.index'));
    $response
      ->assertJsonStructure([
        'data' => ['*' => $this->serializedFields],
        'meta' => [],
        'links' => [],
      ])
      ->assertJson(['meta' => ['per_page' => 15]])
      ->assertStatus(200);

    $resource = CastMemberResource::collection(collect([$this->castMember]));
    $this->assertResource($response, $resource);
  }

  public function testShow()
  {
    $response = $this->get(route('cast_members.show', ['cast_member' => $this->castMember->id]));
    $response->assertStatus(200)->assertJsonStructure([
      'data' => $this->serializedFields
    ]);

    $id = $response->json('data.id');
    $resource = new CastMemberResource(CastMember::find($id));
    $this->assertResource($response, $resource);
  }

  public function testStore()
  {
    $data = ['name' => 'test', 'type' => CastMember::TYPES['DIRECTOR']];
    $this->assertStore($data, $data + ['deleted_at' => null]);

    $data = ['name' => 'test', 'type' => CastMember::TYPES['ACTOR']];
    $response = $this
      ->assertStore(
        $data,
        $data + ['deleted_at' => null]
      )
      ->assertJsonStructure([
        'data' => $this->serializedFields,
      ]);

    $id = $response->json('data.id');
    $resource = new CastMemberResource(CastMember::find($id));
    $this->assertResource($response, $resource);
  }

  public function testUpdate()
  {
    $this->castMember = CastMember::factory()->create([
      'name' => 'First Name',
      'type' => CastMember::TYPES['ACTOR'],
    ]);
    $data = [
      'name' => 'Second Name',
      'type' => CastMember::TYPES['DIRECTOR']
    ];
    $this
      ->assertUpdate($data, $data + ['deleted_at' => null])
      ->assertJsonStructure([
        'data' => $this->serializedFields
      ]);
  }

  public function testValidationData()
  {
    $data = ['name' => ''];
    $this->assertInvalidationInStoreAction($data, 'required');
    $this->assertInvalidationInUpdateAction($data, 'required');

    $data = ['type' => ''];
    $this->assertInvalidationInStoreAction($data, 'required');
    $this->assertInvalidationInUpdateAction($data, 'required');

    $data = ['type' => 'abcd'];
    $this->assertInvalidationInStoreAction($data, 'in');
    $this->assertInvalidationInUpdateAction($data, 'in');
  }

  public function testDelete()
  {
    $this->json('DELETE', $this->routeDelete());
    $this->assertNull(CastMember::find($this->castMember->id));
    $this->assertNotNull(CastMember::withTrashed()->find($this->castMember->id));
  }

  protected function routeStore()
  {
    return route('cast_members.store');
  }

  protected function routeUpdate()
  {
    return route('cast_members.update', ['cast_member' => $this->castMember->id]);
  }

  protected function routeDelete()
  {
    return route('cast_members.destroy', ['cast_member' => $this->castMember->id]);
  }

  protected function model()
  {
    return CastMember::class;
  }
}
