<?php

namespace Tests\Feature\Models\Video;

use App\Models\Video;
use Illuminate\Database\Events\TransactionCommitted;
use Illuminate\Http\UploadedFile;
use Tests\Exceptions\TestException;

class VideoUploadTest extends BaseVideoTestCase
{
  public function testCreateWithBasicFields()
  {
    \Storage::fake();
    $video = Video::create(
      $this->data + [
        'thumb_file' => UploadedFile::fake()->image('thumb.jpg'),
        'video_file' => UploadedFile::fake()->create('video.mp4'),
        'banner_file' => UploadedFile::fake()->create('banner.png'),
        'trailer_file' => UploadedFile::fake()->create('trailer.mp4'),
      ]
    );
    \Storage::assertExists("{$video->id}/{$video->thumb_file}");
    \Storage::assertExists("{$video->id}/{$video->video_file}");
    \Storage::assertExists("{$video->id}/{$video->banner_file}");
    \Storage::assertExists("{$video->id}/{$video->trailer_file}");
  }

  public function testUpdateFilesIfRollbackFiles()
  {
    \Storage::fake();
    $video = Video::factory()->create();
    \Event::listen(TransactionCommitted::class, function () {
      throw new TestException();
    });
    $hasError = false;

    try {
      $video->update([
        'video_file' => UploadedFile::fake()->create('video.mp4'),
        'thumb_file' => UploadedFile::fake()->create('thumb.jpg'),
        'banner_file' => UploadedFile::fake()->create('banner.png'),
        'trailer_file' => UploadedFile::fake()->create('trailer.mp4'),
      ]);
    } catch (TestException $e) {
      $this->assertCount(0, \Storage::allFiles());
      $hasError = true;
    }

    $this->assertTrue($hasError);
  }

  public function testUpdateWithBasicFieldsIfRollback()
  {
    \Storage::fake();
    /** @var Video $video */
    $video = Video::factory()->create();
    \Event::listen(TransactionCommitted::class, function () {
      throw new TestException();
    });
    $hasError = false;

    try {
      $video->update(
        $this->data + [
          'thumb_file' => UploadedFile::fake()->image('thumb.jpg'),
          'video_file' => UploadedFile::fake()->create('video.mp4'),
          'banner_file' => UploadedFile::fake()->create('banner.png'),
          'trailer_file' => UploadedFile::fake()->create('trailer.mp4'),
        ],
      );
    } catch (TestException $err) {
      $this->assertCount(0, \Storage::allFiles());
      $hasError = true;
    }

    $this->assertTrue($hasError);
  }

  public function testUpdateWithFiles()
  {
    \Storage::fake();
    $video = Video::factory()->create();
    $thumbFile = UploadedFile::fake()->image('thumb.jpg');
    $videoFile = UploadedFile::fake()->create('video.mp4');
    $bannerFile = UploadedFile::fake()->create('banner.png');
    $trailerFile = UploadedFile::fake()->create('trailer.mp4');

    $video->update($this->data + [
      'thumb_file' => $thumbFile,
      'video_file' => $videoFile,
      'banner_file' => $bannerFile,
      'trailer_file' => $trailerFile,
    ]);
    \Storage::assertExists("{$video->id}/{$video->thumb_file}");
    \Storage::assertExists("{$video->id}/{$video->video_file}");
    \Storage::assertExists("{$video->id}/{$video->banner_file}");
    \Storage::assertExists("{$video->id}/{$video->trailer_file}");

    $newVideoFile = UploadedFile::fake()->image('video.mp4');
    $video->update($this->data + [
      'video_file' => $newVideoFile
    ]);

    \Storage::assertExists("{$video->id}/{$thumbFile->hashName()}");
    \Storage::assertExists("{$video->id}/{$newVideoFile->hashName()}");
    \Storage::assertMissing("{$video->id}/{$videoFile->hashName()}");
    \Storage::assertExists("{$video->id}/{$trailerFile->hashName()}");
  }
}
