import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { AlbumEntity } from './album.entity';

@Injectable()
export class AlbumService {
   constructor(
       @InjectRepository(AlbumEntity)
       private readonly albumRepository: Repository<AlbumEntity>
   ){}

   async findAll(): Promise<AlbumEntity[]> {
       return await this.albumRepository.find({ relations: ["tracks", "performers"] });
   }

   async findOne(id: string): Promise<AlbumEntity> {
       const album: AlbumEntity = await this.albumRepository.findOne({where: {id}, relations: ["tracks", "performers"] } );
       if (!album)
         throw new BusinessLogicException("The album with the given id was not found", BusinessError.NOT_FOUND);
  
       return album;
   }
  
   async create(album: AlbumEntity): Promise<AlbumEntity> {
    // Validar que el nombre y la descripción no estén vacíos
    if (!album.nombre || !album.descripcion) {
        throw new BusinessLogicException("El nombre y la descripción del álbum no pueden estar vacíos", BusinessError.VALIDATION_ERROR);
    }

    // Continuar con la creación del álbum si pasa la validación
    return await this.albumRepository.save(album);
    }

    async update(id: string, album: AlbumEntity): Promise<AlbumEntity> {
        const persistedAlbum: AlbumEntity = await this.albumRepository.findOne({where:{id}});
        if (!persistedAlbum)
          throw new BusinessLogicException("The album with the given id was not found", BusinessError.NOT_FOUND);
        album.id = id; 
        return await this.albumRepository.save(album);
    }
    
    async delete(id: string) {
        const album: AlbumEntity = await this.albumRepository.findOne({where:{id}});
        if (!album)
          throw new BusinessLogicException("The album with the given id was not found", BusinessError.NOT_FOUND);

       
        if (album.tracks && album.tracks.length > 0) {
            throw new BusinessLogicException("Cannot delete the album because it has associated tracks", BusinessError.INVALID_OPERATION);
        }
     
        await this.albumRepository.remove(album);
    }



}