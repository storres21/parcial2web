/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { PerformerAlbumService } from './performer-album.service';
import { AlbumEntity } from '../album/album.entity';
import { PerformerEntity } from '../performer/performer.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('PerformerAlbumService', () => {
  let service: PerformerAlbumService;
  let performerRepository: Repository<PerformerEntity>;
  let albumRepository: Repository<AlbumEntity>;
  let performer: PerformerEntity;
  let albumsList : AlbumEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PerformerAlbumService],
    }).compile();

    service = module.get<PerformerAlbumService>(PerformerAlbumService);
    performerRepository = module.get<Repository<PerformerEntity>>(getRepositoryToken(PerformerEntity));
    albumRepository = module.get<Repository<AlbumEntity>>(getRepositoryToken(AlbumEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    albumRepository.clear();
    performerRepository.clear();
 
    albumsList = [];
    for(let i = 0; i < 5; i++){
        const album: AlbumEntity = await albumRepository.save({
          id: faker.string.uuid(),
          nombre: "nombre", 
          caratula: "caratula",
          fechaLanzamiento: "2023-08-09T11:33:50.612Z",
          descripcion: faker.lorem.sentence(),
      
      })
      albumsList.push(album);
    }

    performer = await performerRepository.save({
      id: faker.string.uuid(),
      nombre: faker.lorem.sentence(), 
      imagen: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      albums: albumsList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addAlbumPerformer should add an solicitud to a performer', async () => {
    const newAlbum: AlbumEntity = await albumRepository.save({
      id: faker.string.uuid(),
        nombre: "nombre", 
        caratula: "caratula",
        fechaLanzamiento: "2023-08-09T11:33:50.612Z",
        descripcion: faker.lorem.sentence(),
    })
    albumsList.push(newAlbum);

    const newPerformer: PerformerEntity = await performerRepository.save({
      id: faker.string.uuid(),
      nombre: faker.lorem.sentence(), 
      imagen: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      solicitudes: [],
      albums: albumsList
    })
    
    const result: PerformerEntity = await service.addAlbumPerformer(newPerformer.id, newAlbum.id);

    expect(result.albums.length).toBe(7);
    expect(result.albums[5]).not.toBeNull();
    expect(result.albums[5].nombre).toBe(newAlbum.nombre)
    expect(result.albums[5].caratula).toBe(newAlbum.caratula)
    expect(result.albums[5].fechaLanzamiento).toBe(newAlbum.fechaLanzamiento)
    expect(result.albums[5].descripcion).toBe(newAlbum.descripcion)
  });

});
