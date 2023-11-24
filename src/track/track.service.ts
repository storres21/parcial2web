import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { TrackEntity } from './track.entity';
import { tr } from '@faker-js/faker';

@Injectable()
export class TrackService {
   constructor(
       @InjectRepository(TrackEntity)
       private readonly trackRepository: Repository<TrackEntity>
   ){}

   async findAll(): Promise<TrackEntity[]> {
       return await this.trackRepository.find({ relations: ["album"] });
   }

   async findOne(id: string): Promise<TrackEntity> {
       const track: TrackEntity = await this.trackRepository.findOne({where: {id}, relations: ["album"] } );
       if (!track)
         throw new BusinessLogicException("The track with the given id was not found", BusinessError.NOT_FOUND);
  
       return track;
   }
  
   async create(track: TrackEntity): Promise<TrackEntity> {

    if (track.duracion < 0) {
        throw new BusinessLogicException("La duracion del track debe ser un numero positivo", BusinessError.VALIDATION_ERROR);
    }

    return await this.trackRepository.save(track);
}

   


}