import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { TrackDto } from './track.dto/track.dto';
import { TrackEntity } from './track.entity';
import { TrackService } from './track.service';


@Controller('tracks')
@UseInterceptors(BusinessErrorsInterceptor)
export class TrackController {
    constructor(private readonly trackService: TrackService) {}

  @Get()
  async findAll() {
    return await this.trackService.findAll();
  }

  @Get(':trackId')
  async findOne(@Param('trackId') trackId: string) {
    return await this.trackService.findOne(trackId);
  }

  @Post(':albumId') 
  async create(@Param('albumId') albumId: string, @Body() trackDto: TrackDto) {
    const track: TrackEntity = plainToInstance(TrackEntity, trackDto);
    return await this.trackService.create(albumId, track); 
  }

  @Put(':trackId')
  async update(@Param('trackId') trackId: string, @Body() trackDto: TrackDto) {
    const track: TrackEntity = plainToInstance(TrackEntity, trackDto);
    return await this.trackService.update(trackId, track);
  }

  @Delete(':trackId')
  @HttpCode(204)
  async delete(@Param('trackId') trackId: string) {
    return await this.trackService.delete(trackId);
  }
}