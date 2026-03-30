import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DraftsService } from './drafts.service';

@Controller('drafts')
export class DraftsController {
  constructor(private readonly draftsService: DraftsService) {}

  @Post()
  create(@Body() createDraftDto: any) {
    return this.draftsService.create(createDraftDto);
  }

  @Get()
  findAll() {
    return this.draftsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.draftsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDraftDto: any) {
    return this.draftsService.update(+id, updateDraftDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.draftsService.remove(+id);
  }
}
