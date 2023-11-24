import { Module } from '@nestjs/common';
// import { AlbumService } from './album.service';
import { AlbumEntity } from './album.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';

@Module({
    imports: [TypeOrmModule.forFeature([AlbumEntity])],
    providers: [AlbumService],
    // providers: [AlbumService],
    // controllers: [AlbumController]

})
export class AlbumModule {}
