/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { PerformerEntity } from '../performer/performer.entity';
import { Repository } from 'typeorm';
import { AlbumEntity } from '../album/album.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AlbumPerformerService } from './album-performer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AlbumPerformerService', () => {
  let service: AlbumPerformerService;
  let albumRepository: Repository<AlbumEntity>;
  let performerRepository: Repository<PerformerEntity>;
  let album: AlbumEntity;
  let performersList : PerformerEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AlbumPerformerService],
    }).compile();

    service = module.get<AlbumPerformerService>(AlbumPerformerService);
    albumRepository = module.get<Repository<AlbumEntity>>(getRepositoryToken(AlbumEntity));
    performerRepository = module.get<Repository<PerformerEntity>>(getRepositoryToken(PerformerEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    performerRepository.clear();
    albumRepository.clear();

    performersList = [];
    for(let i = 0; i < 5; i++){
        const performer: PerformerEntity = await performerRepository.save({
          nombre: faker.lorem.sentence(),
          descripcion: faker.lorem.sentence(),
          imagen: faker.lorem.sentence(),
        })
        performersList.push(performer);
    }

    album = await albumRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      fechaLanzamiento: faker.date.past(),
      caratula: faker.lorem.sentence(),
      performers: performersList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addPerformerAlbum should add an performer to a album', async () => {
    const newPerformer: PerformerEntity = await performerRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.lorem.sentence(),
    });
    

    const newAlbum: AlbumEntity = await albumRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      fechaLanzamiento: faker.date.past(),
      caratula: faker.lorem.sentence(),
    });


    const result: AlbumEntity = await service.addPerformerAlbum(newAlbum.id, newPerformer.id);
    
    expect(result.performers.length).toBe(1);
    expect(result.performers[0].id).toBe(newPerformer.id);
    expect(result.performers[0].nombre).toEqual(newPerformer.nombre);
    expect(result.performers[0].descripcion).toEqual(newPerformer.descripcion);
    expect(result.performers[0].imagen).toEqual(newPerformer.imagen);
    
  });

  it('addPerformerAlbum should thrown exception for an invalid performer', async () => {
    const newAlbum: AlbumEntity = await albumRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      fechaLanzamiento: faker.date.past(),
      caratula: faker.lorem.sentence(),
    })

    await expect(() => service.addPerformerAlbum(newAlbum.id, "0")).rejects.toHaveProperty("message", "The performer with the given id was not found");
  });

  it('addPerformerAlbum should throw an exception for an invalid album', async () => {
    const newPerformer: PerformerEntity = await performerRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.lorem.sentence(),
    });

    await expect(() => service.addPerformerAlbum("0", newPerformer.id)).rejects.toHaveProperty("message", "The album with the given id was not found");
  });

  it('addPerformerAlbum should throw an exception when trying to add more than 3 performers to an album', async () => {
    const newAlbum: AlbumEntity = await albumRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      fechaLanzamiento: faker.date.past(),
      caratula: faker.lorem.sentence(),
    });
  
    const newPerformer1: PerformerEntity = await performerRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.lorem.sentence(),
    });
  
    const newPerformer2: PerformerEntity = await performerRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.lorem.sentence(),
    });
  
    const newPerformer3: PerformerEntity = await performerRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.lorem.sentence(),
    });
  
    // Agregar tres intérpretes al álbum
    await service.addPerformerAlbum(newAlbum.id, newPerformer1.id);
    await service.addPerformerAlbum(newAlbum.id, newPerformer2.id);
    await service.addPerformerAlbum(newAlbum.id, newPerformer3.id);
  
    // Intentar agregar un cuarto intérprete debería lanzar una excepción
    const fourthPerformer: PerformerEntity = await performerRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.lorem.sentence(),
    });
  
    await expect(() => service.addPerformerAlbum(newAlbum.id, fourthPerformer.id))
      .rejects.toHaveProperty("message", "The album already has the maximum number of performers allowed");
    });
  

  it('findPerformerByAlbumIdPerformerId should return performer by album', async () => {
    const performer: PerformerEntity = performersList[0];
    const storedPerformer: PerformerEntity = await service.findPerformerByAlbumIdPerformerId(album.id, performer.id, )
    expect(storedPerformer).not.toBeNull();
    expect(storedPerformer.id).toBe(performer.id);
    expect(storedPerformer.nombre).toEqual(performer.nombre);
    expect(storedPerformer.descripcion).toEqual(performer.descripcion);
    expect(storedPerformer.imagen).toEqual(performer.imagen);
  
  });

  it('findPerformerByAlbumIdPerformerId should throw an exception for an invalid performer', async () => {
    await expect(()=> service.findPerformerByAlbumIdPerformerId(album.id, "0")).rejects.toHaveProperty("message", "The performer with the given id was not found"); 
  });

  it('findPerformerByAlbumIdPerformerId should throw an exception for an invalid album', async () => {
    const performer: PerformerEntity = performersList[0]; 
    await expect(()=> service.findPerformerByAlbumIdPerformerId("0", performer.id)).rejects.toHaveProperty("message", "The album with the given id was not found"); 
  });

  it('findPerformerByAlbumIdPerformerId should throw an exception for an performer not associated to the album', async () => {
    const newPerformer: PerformerEntity = await performerRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.lorem.sentence(),
    });

    await expect(()=> service.findPerformerByAlbumIdPerformerId(album.id, newPerformer.id)).rejects.toHaveProperty("message", "The performer with the given id is not associated to the album"); 
  });

  it('findPerformersByAlbumId should return performers by album', async ()=>{

    const performers: PerformerEntity[] = await service.findPerformersByAlbumId(album.id);
    expect(performers.length).toBe(5)
  });

  it('findPerformersByAlbumId should throw an exception for an invalid album', async () => {
    await expect(()=> service.findPerformersByAlbumId("0")).rejects.toHaveProperty("message", "The album with the given id was not found"); 
  });

  it('associatePerformersAlbum should update performers list for a album', async () => {
    const newPerformer: PerformerEntity = await performerRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.lorem.sentence(),
    });

    const updatedAlbum: AlbumEntity = await service.associatePerformersAlbum(album.id, [newPerformer]);
    expect(updatedAlbum.performers.length).toBe(1);
    expect(updatedAlbum.performers[0].id).toBe(newPerformer.id);
    expect(updatedAlbum.performers[0].nombre).toEqual(newPerformer.nombre);
    expect(updatedAlbum.performers[0].descripcion).toEqual(newPerformer.descripcion);
    expect(updatedAlbum.performers[0].imagen).toEqual(newPerformer.imagen);
    
  });

  it('associatePerformersAlbum should throw an exception for an invalid album', async () => {
    const newPerformer: PerformerEntity = await performerRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.lorem.sentence(),
    });

    await expect(()=> service.associatePerformersAlbum("0", [newPerformer])).rejects.toHaveProperty("message", "The album with the given id was not found"); 
  });

  it('associatePerformersAlbum should throw an exception for an invalid performer', async () => {
    const newPerformer: PerformerEntity = performersList[0];
    newPerformer.id = "0";

    await expect(()=> service.associatePerformersAlbum(album.id, [newPerformer])).rejects.toHaveProperty("message", "The performer with the given id was not found"); 
  });

  it('deletePerformerToAlbum should remove an performer from a album', async () => {
    const performer: PerformerEntity = performersList[0];
    await service.deletePerformerAlbum(album.id, performer.id);

    const storedAlbum: AlbumEntity = await albumRepository.findOne({where: {id: album.id}, relations: ["performers"]});
    const deletedPerformer: PerformerEntity = storedAlbum.performers.find(a => a.id === performer.id);

    expect(deletedPerformer).toBeUndefined();

  });

  it('deletePerformerToAlbum should thrown an exception for an invalid performer', async () => {
    await expect(()=> service.deletePerformerAlbum(album.id, "0")).rejects.toHaveProperty("message", "The performer with the given id was not found"); 
  });

  it('deletePerformerToAlbum should thrown an exception for an invalid album', async () => {
    const performer: PerformerEntity = performersList[0];
    await expect(()=> service.deletePerformerAlbum("0", performer.id)).rejects.toHaveProperty("message", "The album with the given id was not found"); 
  });

  it('deletePerformerToAlbum should thrown an exception for an non asocciated performer', async () => {
    const newPerformer: PerformerEntity = await performerRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.lorem.sentence(),
    });
    await expect(()=> service.deletePerformerAlbum(album.id, newPerformer.id)).rejects.toHaveProperty("message", "The performer with the given id is not associated to the album"); 
  }); 

});