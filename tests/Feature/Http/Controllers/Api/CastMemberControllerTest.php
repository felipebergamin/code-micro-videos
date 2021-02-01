<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Models\CastMember;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;
use Tests\Traits\TestSaves;
use Tests\Traits\TestValidations;

class CastMemberControllerTest extends TestCase
{
  use DatabaseMigrations, TestValidations, TestSaves;

  /** @var CastMember */
  private $castMember;

  protected function setUp(): void
  {
    parent::setUp();
    $this->castMember = CastMember::factory()->create();
  }

  public function testIndex()
  {
    $response = $this->get(route('cast_members.index'));
    $response->assertStatus(200)->assertJson([$this->castMember->toArray()]);
  }

  public function testShow()
  {
    $response = $this->get(route('cast_members.show', ['cast_member' => $this->castMember->id]));
    $response->assertStatus(200)->assertJson($this->castMember->toArray());
  }

  public function testStore()
  {
    $data = ['name' => 'test', 'type' => CastMember::TYPES['DIRECTOR']];
    $this->assertStore($data, $data + ['deleted_at' => null]);

    $data = ['name' => 'test', 'type' => CastMember::TYPES['ACTOR']];
    $this
      ->assertStore(
        $data,
        $data + ['deleted_at' => null]
      )
      ->assertJsonStructure([
        'created_at', 'updated_at'
      ]);
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
        'created_at', 'updated_at'
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
