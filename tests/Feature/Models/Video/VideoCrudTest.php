<?php

namespace Tests\Feature\Models\Video;

use App\Models\Category;
use App\Models\Genre;
use App\Models\Video;
use Illuminate\Database\QueryException;

class VideoCrudTest extends BaseVideoTestCase
{
  private $fileFieldsData = [];

  protected function setUp(): void
  {
    parent::setUp();
    foreach (Video::$fileFields as $field) {
      $this->fileFieldsData[$field] = "$field.test";
    }
  }

  public function testList()
  {
    Video::factory()->create();
    $videos = Video::all();
    $this->assertCount(1, $videos);
    $videoKeys = array_keys($videos->first()->getAttributes());
    $this->assertEqualsCanonicalizing([
      'id',
      'title',
      'description',
      'year_launched',
      'opened',
      'rating',
      'duration',
      'created_at',
      'updated_at',
      'deleted_at',
      'video_file',
    ], $videoKeys);
  }

  public function testCreateWithBasicFields()
  {
    $video = Video::create($this->data + $this->fileFieldsData);
    $video->refresh();

    $this->assertEquals(36, strlen($video->id));
    $this->assertFalse($video->opened);
    $this->assertDatabaseHas('videos', $this->data + $this->fileFieldsData + ['opened' => false]);

    $video = Video::create($this->data + ['opened' => true]);
    $this->assertTrue($video->opened);
    $this->assertDatabaseHas('videos', ['opened' => true, 'id' => $video->id]);
  }

  public function testCreateWithRelations()
  {
    $category = Category::factory()->create();
    $genre = Genre::factory()->create();
    $video = Video::create($this->data + [
      'categories_id' => [$category->id],
      'genres_id' => [$genre->id]
    ]);

    $this->assertHasCategory($video->id, $category->id);
    $this->assertHasGenre($video->id, $genre->id);
  }

  public function testUpdateWithBasicFields()
  {
    /** @var Video */
    $video = Video::factory()->create(['opened' => false]);
    $video->update($this->data + $this->fileFieldsData);
    $this->assertFalse($video->opened);
    $this->assertDatabaseHas('videos', $this->data + $this->fileFieldsData + ['opened' => false]);

    $video = Video::factory()->create(['opened' => false]);
    $video->update($this->data + $this->fileFieldsData + ['opened' => true]);
    $this->assertTrue($video->opened);
    $this->assertDatabaseHas('videos', $this->data + $this->fileFieldsData + ['opened' => true]);
  }

  public function testUpdateWithRelations()
  {
    $category = Category::factory()->create();
    $genre = Genre::factory()->create();
    $video = Video::factory()->create();

    $video->update($this->data + [
      'categories_id' => [$category->id],
      'genres_id' => [$genre->id],
    ]);

    $this->assertHasCategory($video->id, $category->id);
    $this->assertHasGenre($video->id, $genre->id);
  }

  public function testHandleRelations()
  {
    /** @var Video */
    $video = Video::factory()->create();
    Video::handleRelations($video, []);
    $this->assertCount(0, $video->categories);
    $this->assertCount(0, $video->genres);

    $category = Category::factory()->create();
    Video::handleRelations($video, [
      'categories_id' => [$category->id],
    ]);
    $video->refresh();
    $this->assertCount(1, $video->categories);

    $genre = Genre::factory()->create();
    Video::handleRelations($video, [
      'genres_id' => [$genre->id]
    ]);
    $video->refresh();
    $this->assertCount(1, $video->genres);

    $video->categories()->delete();
    $video->genres()->delete();

    Video::handleRelations($video, [
      'categories_id' => [$category->id],
      'genres_id' => [$genre->id],
    ]);
    $video->refresh();
    $this->assertCount(1, $video->categories);
    $this->assertCount(1, $video->genres);
  }

  public function testSyncCategories()
  {
    $categoriesId = Category::factory(3)->create()->pluck('id')->toArray();
    $video = Video::factory()->create();

    Video::handleRelations($video, [
      'categories_id' => [$categoriesId[0]],
    ]);
    $this->assertDatabaseHas('category_video', [
      'category_id' => $categoriesId[0],
      'video_id' => $video->id,
    ]);

    Video::handleRelations($video, [
      'categories_id' => [$categoriesId[1], $categoriesId[2]],
    ]);
    $this->assertDatabaseMissing('category_video', [
      'category_id' => $categoriesId[0],
      'video_id' => $video->id,
    ]);
    $this->assertDatabaseHas('category_video', [
      'category_id' => $categoriesId[1],
      'video_id' => $video->id,
    ]);
    $this->assertDatabaseHas('category_video', [
      'category_id' => $categoriesId[2],
      'video_id' => $video->id,
    ]);
  }

  public function testSyncGenres()
  {
    /** @var Collection */
    $genres = Genre::factory(3)->create();
    $genresId = $genres->pluck('id')->toArray();
    $video = Video::factory()->create();

    Video::handleRelations(
      $video,
      [
        'genres_id' => [$genresId[0]],
      ]
    );
    $this->assertDatabaseHas('genre_video', [
      'genre_id' => $genresId[0],
      'video_id' => $video->id,
    ]);

    Video::handleRelations(
      $video,
      [
        'genres_id' => [$genresId[1], $genresId[2]],
      ],
    );
    $this->assertDatabaseMissing('genre_video', [
      'genre_id' => $genresId[0],
      'video_id' => $video->id,
    ]);
    $this->assertDatabaseHas('genre_video', [
      'genre_id' => $genresId[1],
      'video_id' => $video->id,
    ]);
    $this->assertDatabaseHas('genre_video', [
      'genre_id' => $genresId[2],
      'video_id' => $video->id,
    ]);
  }

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

  protected function assertHasCategory($videoId, $categoryId)
  {
    $this->assertDatabaseHas('category_video', [
      'video_id' => $videoId,
      'category_id' => $categoryId,
    ]);
  }

  protected function assertHasGenre($videoId, $genreId)
  {
    $this->assertDatabaseHas('genre_video', [
      'genre_id' => $genreId,
      'video_id' => $videoId,
    ]);
  }
}
