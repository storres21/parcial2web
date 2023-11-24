import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumModule } from './album/album.module';
import { TrackModule } from './track/track.module';
import { PerformerModule } from './performer/performer.module';
import { AlbumPerformerModule } from './album-performer/album-performer.module';


@Module({
  imports: [PerformerModule, AlbumModule, TrackModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'aeropuerto',
      entities: [PerformerModule, AlbumModule, TrackModule],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true
    }),
    // AerolineaAeropuertoModule,
    AlbumModule,
    TrackModule,
    PerformerModule,
    AlbumPerformerModule,

  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
