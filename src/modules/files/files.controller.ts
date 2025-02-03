import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('signed-url')
  async getSignedUrl(@Body() body: { fileName: string; contentType: string }) {
    return this.filesService.generateSignedUrl(body.contentType, body.fileName);
  }

  @Post('public')
  async setPublicAccess(@Body() body: { fileName: string }) {
    return this.filesService.setPublicAccess(body.fileName);
  }

  @Get('download/:name')
  getFile(@Param('name') name: string) {
    return this.filesService.downloadFile(name);
  }

  @Delete(':name')
  deleteFile(@Param('name') name: string) {
    return this.filesService.deleteFileByName(name);
  }
}
