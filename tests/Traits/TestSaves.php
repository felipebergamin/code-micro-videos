<?php

namespace Tests\Traits;

use Illuminate\Testing\TestResponse;

trait TestSaves
{
  protected function assertStore(array $sendData, array $testDatabase, array $testJson = null): TestResponse
  {
    /** @var TestResponse $response */
    $response = $this->json('POST', $this->routeStore(), $sendData);
    $responseStatus = $response->baseResponse->status();
    if ($responseStatus !== 201) {
      throw new \Exception("Response status must be 201, given {$responseStatus}:\n{$response->baseResponse->content()} ");
    }

    $this->assertInDatabase($response, $testDatabase);
    $this->assertJsonResponseContent($response, $testDatabase, $testJson);
    return $response;
  }

  protected function assertUpdate(array $sendData, array $testDatabase, array $testJson = null): TestResponse
  {
    /** @var TestResponse $response */
    $response = $this->json('PUT', $this->routeUpdate(), $sendData);
    $responseStatus = $response->baseResponse->status();
    if ($responseStatus !== 200) {
      throw new \Exception("Response status must be 201, given {$responseStatus}:\n{$response->baseResponse->content()} ");
    }

    $this->assertInDatabase($response, $testDatabase);
    $this->assertJsonResponseContent($response, $testDatabase, $testJson);
    return $response;
  }

  private function assertInDatabase(TestResponse $response, array $testDatabase)
  {
    $model = $this->model();
    $table = (new $model)->getTable();
    $this->assertDatabaseHas($table, $testDatabase + ['id' => $response->json('id')]);
  }

  private function assertJsonResponseContent(TestResponse $response, array $testDatabase, array $testJsonData = null)
  {
    $testResponse = $testJsonData ?? $testDatabase;
    $response->assertJsonFragment($testResponse + ['id' => $response->json('id')]);
  }
}
