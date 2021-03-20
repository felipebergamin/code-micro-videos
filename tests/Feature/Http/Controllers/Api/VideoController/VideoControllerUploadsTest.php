<?php

namespace Tests\Feature\Http\Controllers\Api\VideoController;

use App\Models\Video;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;
use Illuminate\Testing\TestResponse;
use Tests\Traits\TestUploads;
use Tests\Traits\TestValidations;

class VideoControllerUploadsTest extends BaseVideoControllerTestCase
{
  use TestValidations, TestUploads;

  public function testInvalidationVideoField()
  {
    $this->assertInvalidationFile(
      'video_file',
      'mp4',
      Video::VIDEO_FILE_MAX_SIZE,
      'mimetypes',
      ['values' => 'video/mp4']
    );
  }

  public function testInvalidationThumberFile()
  {
    $this->assertInvalidationFile(
      'thumb_file',
      'png',
      Video::THUMB_FILE_MAX_SIZE,
      'image'
    );
  }

  public function testInvalidationBannerFile()
  {
    $this->assertInvalidationFile(
      'banner_file',
      'jpg',
      Video::BANNER_FILE_MAX_SIZE,
      'image'
    );
  }

  public function testInvalidationTrailerFile()
  {
    $this->assertInvalidationFile(
      'trailer_file',
      'mp4',
      Video::TRAILER_FILE_MAX_SIZE,
      'mimetypes',
      ['values' => 'video/mp4']
    );
  }

  public function testStoreWithFiles()
  {
    \Storage::fake();
    $files = $this->getFiles();

    $response = $this->json(
      'POST',
      $this->routeStore(),
      $this->sendData + $files
    );

    $response->assertStatus(201);
    $this->assertFilesOnPersist($response, $files);
  }

  public function testUpdateWithFiles()
  {
    \Storage::fake();
    $files = $this->getFiles();

    $response = $this->json(
      'PUT',
      $this->routeUpdate(),
      $this->sendData + $files
    );

    // dd($response->baseResponse->content());

    $response->assertStatus(200);
    $this->assertFilesOnPersist($response, $files);

    $newFiles = [
      'thumb_file' => UploadedFile::fake()->create('thumb_file.jpg'),
      'video_file' => UploadedFile::fake()->create('video_file.mp4')
    ];

    $response = $this->json(
      'PUT',
      $this->routeUpdate(),
      $this->sendData + $newFiles
    );

    $response->assertStatus(200);
    $this->assertFilesOnPersist($response, Arr::except($files, ['thumb_file', 'video_file']) + $newFiles);

    $id = $response->json('id');
    $video = Video::find($id);
    \Storage::assertMissing($video->relativeFilePath($files['thumb_file']->hashName()));
    \Storage::assertMissing($video->relativeFilePath($files['video_file']->hashName()));
  }

  protected function assertFilesOnPersist(TestResponse $response, $files)
  {
    $id = $response->json('id') ?? $response->json('data.id');
    $video = Video::find($id);
    $this->assertFilesExistInStorage($video, $files);
  }

  protected function getFiles()
  {
    return [
      'video_file' => UploadedFile::fake()->create('video.mp4'),
      'banner_file' => UploadedFile::fake()->create('banner.jpg'),
      'thumb_file' => UploadedFile::fake()->create('thumb.jpg'),
      'trailer_file' => UploadedFile::fake()->create('trailer.mp4'),
    ];
  }

  protected function routeStore()
  {
    return route('videos.store');
  }

  protected function routeUpdate()
  {
    return route('videos.update', ['video' => $this->video->id]);
  }

  protected function routeDelete()
  {
    return route('videos.destroy', ['video' => $this->video->id]);
  }

  protected function model()
  {
    return Video::class;
  }
}
