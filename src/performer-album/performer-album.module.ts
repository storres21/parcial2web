import { Module } from '@nestjs/common';
import { PerformerEntity } from '../performer/performer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerformerAlbumService } from './performer-album.service';
import { AlbumEntity } from 'src/album/album.entity';
// import { PerformerAlbumController } from './performer-album.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PerformerEntity, AlbumEntity])],
  providers: [PerformerAlbumService],
//   controllers: [PerformerAlbumController]
})
export class PerformerAlbumModule {}
