<?php

namespace Tests\Feature\Http\Controllers\Api\VideoController;

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
      52428800,
      'mimetypes',
      ['values' => 'video/mp4']
    );
  }

  public function testInvalidationThumberFile()
  {
    $this->assertInvalidationFile(
      'thumb_file',
      'png',
      5120,
      'image'
    );
  }

  public function testInvalidationBannerFile()
  {
    $this->assertInvalidationFile(
      'banner_file',
      'jpg',
      10240,
      'image'
    );
  }

  public function testInvalidationTrailerFile()
  {
    $this->assertInvalidationFile(
      'trailer_file',
      'mp4',
      1048576,
      'mimetypes',
      ['values' => 'video/mp4']
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
