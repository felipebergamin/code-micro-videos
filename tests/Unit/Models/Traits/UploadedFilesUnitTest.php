<?php

namespace Tests\Unit\Models\Traits;

use Tests\TestCase;
use Illuminate\Http\UploadedFile;
use Tests\Stubs\Models\UploadFilesStub;

class UploadedFilesUnitTest extends TestCase
{
  /** @var UploadFilesStub $obj */
  private $obj;

  protected function setUp(): void
  {
    parent::setUp();
    $this->obj = new UploadFilesStub();
  }

  public function testUploadFile()
  {
    \Storage::fake();
    $file = UploadedFile::fake()->create('video.mp4');
    $this->obj->uploadFile($file);
    \Storage::assertExists("1/{$file->hashName()}");
  }
}
