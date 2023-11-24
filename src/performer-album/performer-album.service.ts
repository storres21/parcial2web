/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PerformerEntity } from '../performer/performer.entity';
import { AlbumEntity } from '../album/album.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class PerformerAlbumService {
    constructor(
        @InjectRepository(PerformerEntity)
        private readonly performerRepository: Repository<PerformerEntity>,

        @InjectRepository(AlbumEntity)
        private readonly albumRepository: Repository<AlbumEntity>
    ) {}

    async addAlbumPerformer(performerId: string, albumId: string): Promise<PerformerEntity> {
        const album: AlbumEntity = await this.albumRepository.findOne({where: {id: albumId}});
        if (!album)
          throw new BusinessLogicException("The album with the given id was not found", BusinessError.NOT_FOUND);
      
        const performer: PerformerEntity = await this.performerRepository.findOne({where: {id: performerId}, relations: ["albums"]})
        if (!performer)
          throw new BusinessLogicException("The performer with the given id was not found", BusinessError.NOT_FOUND);
    
        performer.albums = [...performer.albums, album];
        return await this.performerRepository.save(performer);
      }

}