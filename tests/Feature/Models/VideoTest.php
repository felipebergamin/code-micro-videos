<?php

namespace Tests\Feature\Models\VideoTest;

use App\Models\Video;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\Exceptions\TestException;
use Tests\TestCase;

class VideoTest extends TestCase
{
  use DatabaseMigrations;

  public function testRollbackCreate()
  {
    $hasError = false;
    try {
      Video::create([
        'title' => 'title',
        'description' => 'description',
        'year_launched' => 2010,
        'rating' => Video::RATING_LIST[0],
        'duration' => 90,
        'categories_id' => [0, 1, 2]
      ]);
    } catch (QueryException $e) {
      $this->assertCount(0, Video::all());
      $hasError = true;
    }

    $this->assertTrue($hasError);
  }

  public function testRollbackUpdate()
  {
    /** @var Video */
    $video = Video::factory()->create();
    $title = $video->title;

    $hasError = false;
    try {
      $video->update([
        'title' => 'title',
        'description' => 'description',
        'year_launched' => 2010,
        'rating' => Video::RATING_LIST[0],
        'duration' => 90,
        'categories_id' => [0, 1, 2]
      ]);
    } catch (QueryException $e) {
      $this->assertDatabaseHas('videos', [
        'id' => $video->id,
        'title' => $title
      ]);
      $hasError = true;
    }

    $this->assertTrue($hasError);
  }
}
