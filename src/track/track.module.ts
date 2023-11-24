import { Module } from '@nestjs/common';
// import { TrackService } from './track.service';
import { TrackEntity } from './track.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { TrackController } from './track.controller';
import { TrackService } from './track.service';


@Module({
  imports: [TypeOrmModule.forFeature([TrackEntity])],
  providers: [TrackService],
//   providers: [TrackService],
//   controllers: [TrackController]
})
export class TrackModule {}
