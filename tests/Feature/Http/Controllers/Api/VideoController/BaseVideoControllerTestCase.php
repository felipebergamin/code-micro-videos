<?php

namespace Tests\Feature\Http\Controllers\Api\VideoController;

use App\Models\Category;
use App\Models\Genre;
use App\Models\Video;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

abstract class BaseVideoControllerTestCase extends TestCase
{
  use DatabaseMigrations;

  /** @var Video */
  protected $video;
  protected $sendData;

  protected function setUp(): void
  {
    parent::setUp();
    $category = Category::factory()->create();
    $genre = Genre::factory()->create();
    $genre->categories()->sync($category);

    $this->video = Video::factory()->create([
      'opened' => false,
    ])->refresh();
    $this->sendData = [
      'title' => 'title',
      'description' => 'description',
      'year_launched' => 2010,
      'rating' => Video::RATING_LIST[0],
      'duration' => 90,
      "categories_id" => [$category->id],
      "genres_id" => [$genre->id]
    ];
  }
}
