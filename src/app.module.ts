import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumModule } from './album/album.module';
import { TrackModule } from './track/track.module';
import { PerformerModule } from './performer/performer.module';
import { AlbumPerformerModule } from './album-performer/album-performer.module';
import { AlbumEntity } from './album/album.entity';
import { PerformerEntity } from './performer/performer.entity';
import { TrackEntity } from './track/track.entity';
import { AlbumPerformerController } from './album-performer/album-performer.controller';



@Module({
  imports: [PerformerModule, AlbumModule, TrackModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'album',
      entities: [PerformerEntity, AlbumEntity, TrackEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true
    }),
    AlbumPerformerModule,

  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
