<?php

namespace Tests\Feature\Http\Controllers\Api\VideoController;

use App\Http\Controllers\VideoController;
use Illuminate\Http\UploadedFile;
use Tests\Traits\TestValidations;

class VideoControllerUploadsTest extends BaseVideoControllerTestCase
{
  use TestValidations;

  public function testVideoUploadInvalidation()
  {
    \Storage::fake();

    $file = UploadedFile::fake()->create('selfie.png')->mimeType('image/png');
    $this->assertInvalidationInStoreAction(
      ['video_file' => $file],
      'mimetypes',
      ['attribute' => 'video file', 'values' => 'video/mp4']
    );

    $file = UploadedFile::fake()->create('video.mp4')->mimeType('video/mp4')->size(VideoController::MAX_FILE_SIZE + 10);
    $this->assertInvalidationInStoreAction(
      ['video_file' => $file],
      'max.file',
      ['attribute' => 'video file', 'max' => VideoController::MAX_FILE_SIZE]
    );
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
