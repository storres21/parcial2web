import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackEntity } from './track.entity';
import { TrackController } from './track.controller';
import { AlbumEntity } from '../album/album.entity'; // Asegúrate de proporcionar la ruta correcta

@Module({
  providers: [TrackService],
  imports: [TypeOrmModule.forFeature([TrackEntity, AlbumEntity])], // Agrega AlbumEntity a los features
  controllers: [TrackController],
})
export class TrackModule {}