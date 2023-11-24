/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { Repository } from 'typeorm';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AerolineaAeropuertoService', () => {
  let service: AerolineaAeropuertoService;
  let aerolineaRepository: Repository<AerolineaEntity>;
  let aeropuertoRepository: Repository<AeropuertoEntity>;
  let aerolinea: AerolineaEntity;
  let aeropuertosList : AeropuertoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AerolineaAeropuertoService],
    }).compile();

    service = module.get<AerolineaAeropuertoService>(AerolineaAeropuertoService);
    aerolineaRepository = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));
    aeropuertoRepository = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    aeropuertoRepository.clear();
    aerolineaRepository.clear();

    aeropuertosList = [];
    for(let i = 0; i < 5; i++){
        const aeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
          id: faker.string.uuid(),
          nombre: faker.lorem.sentence(),
          codigo: faker.string.alphanumeric(3),
          pais: faker.lorem.sentence(),
          ciudad: faker.lorem.sentence()
        })
        aeropuertosList.push(aeropuerto);
    }

    aerolinea = await aerolineaRepository.save({
      id: faker.string.uuid(),
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(), 
      fechaFundacion: faker.date.past(), 
      paginaWeb: faker.lorem.sentence(), 
      aeropuertos: aeropuertosList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addAeropuertoAerolinea should add an aeropuerto to a aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      id: faker.string.uuid(),
      nombre: faker.lorem.sentence(),
      codigo: "123",
      pais: faker.lorem.sentence(),
      ciudad: faker.lorem.sentence()
    });
    aeropuertosList.push(newAeropuerto);

    const newAerolinea: AerolineaEntity = await aerolineaRepository.save({
      id: faker.string.uuid(),
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(), 
      fechaFundacion: faker.date.past(), 
      paginaWeb: faker.lorem.sentence(), 
      aeropuertos: aeropuertosList
    })

    const result: AerolineaEntity = await service.addAeropuertoAerolinea(newAerolinea.id, newAeropuerto.id);
    
    expect(result.aeropuertos.length).toBe(1);
    expect(result.aeropuertos[0]).not.toBeNull();
    expect(result.aeropuertos[0].nombre).toBe(newAeropuerto.nombre)
    expect(result.aeropuertos[0].codigo).toBe(newAeropuerto.codigo)
    expect(result.aeropuertos[0].pais).toBe(newAeropuerto.pais)
    expect(result.aeropuertos[0].ciudad).toBe(newAeropuerto.ciudad)
  });

  it('addAeropuertoAerolinea should thrown exception for an invalid aeropuerto', async () => {
    const newAerolinea: AerolineaEntity = await aerolineaRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(), 
      fechaFundacion: faker.date.past(), 
      paginaWeb: faker.lorem.sentence(),
      aeropuertos: [] 
    })

    await expect(() => service.addAeropuertoAerolinea(newAerolinea.id, "0")).rejects.toHaveProperty("message", "The aeropuerto with the given id was not found");
  });

  it('addAeropuertoAerolinea should throw an exception for an invalid aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.lorem.sentence(),
      codigo: "123",
      pais: faker.lorem.sentence(),
      ciudad: faker.lorem.sentence()
    });
    aeropuertosList.push(newAeropuerto);

    await expect(() => service.addAeropuertoAerolinea("0", newAeropuerto.id)).rejects.toHaveProperty("message", "The aerolinea with the given id was not found");
  });

  it('findAeropuertoByAerolineaIdAeropuertoId should return aeropuerto by aerolinea', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    const storedAeropuerto: AeropuertoEntity = await service.findAeropuertoByAerolineaIdAeropuertoId(aerolinea.id, aeropuerto.id, )
    expect(storedAeropuerto).not.toBeNull();
    expect(storedAeropuerto.nombre).toBe(aeropuerto.nombre);
    expect(storedAeropuerto.codigo).toBe(aeropuerto.codigo);
    expect(storedAeropuerto.pais).toBe(aeropuerto.pais);
    expect(storedAeropuerto.ciudad).toBe(aeropuerto.ciudad);
  });

  it('findAeropuertoByAerolineaIdAeropuertoId should throw an exception for an invalid aeropuerto', async () => {
    await expect(()=> service.findAeropuertoByAerolineaIdAeropuertoId(aerolinea.id, "0")).rejects.toHaveProperty("message", "The aeropuerto with the given id was not found"); 
  });

  it('findAeropuertoByAerolineaIdAeropuertoId should throw an exception for an invalid aerolinea', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0]; 
    await expect(()=> service.findAeropuertoByAerolineaIdAeropuertoId("0", aeropuerto.id)).rejects.toHaveProperty("message", "The aerolinea with the given id was not found"); 
  });

  it('findAeropuertoByAerolineaIdAeropuertoId should throw an exception for an aeropuerto not associated to the aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.lorem.sentence(),
      codigo: "123",
      pais: faker.lorem.sentence(),
      ciudad: faker.lorem.sentence()
    });

    await expect(()=> service.findAeropuertoByAerolineaIdAeropuertoId(aerolinea.id, newAeropuerto.id)).rejects.toHaveProperty("message", "The aeropuerto with the given id is not associated to the aerolinea"); 
  });

  it('findAeropuertosByAerolineaId should return aeropuertos by aerolinea', async ()=>{
    const aeropuertos: AeropuertoEntity[] = await service.findAeropuertosByAerolineaId(aerolinea.id);
    expect(aeropuertos.length).toBe(5)
  });

  it('findAeropuertosByAerolineaId should throw an exception for an invalid aerolinea', async () => {
    await expect(()=> service.findAeropuertosByAerolineaId("0")).rejects.toHaveProperty("message", "The aerolinea with the given id was not found"); 
  });

  it('associateAeropuertosAerolinea should update aeropuertos list for a aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.lorem.sentence(),
      codigo: "123",
      pais: faker.lorem.sentence(),
      ciudad: faker.lorem.sentence() 
    });

    const updatedAerolinea: AerolineaEntity = await service.associateAeropuertosAerolinea(aerolinea.id, [newAeropuerto]);
    expect(updatedAerolinea.aeropuertos.length).toBe(1);

    expect(updatedAerolinea.aeropuertos[0].nombre).toBe(newAeropuerto.nombre);
    expect(updatedAerolinea.aeropuertos[0].codigo).toBe(newAeropuerto.codigo);
    expect(updatedAerolinea.aeropuertos[0].pais).toBe(newAeropuerto.pais);
    expect(updatedAerolinea.aeropuertos[0].ciudad).toBe(newAeropuerto.ciudad);
  });

  it('associateAeropuertosAerolinea should throw an exception for an invalid aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.lorem.sentence(),
      codigo: "123",
      pais: faker.lorem.sentence(),
      ciudad: faker.lorem.sentence()
    });

    await expect(()=> service.associateAeropuertosAerolinea("0", [newAeropuerto])).rejects.toHaveProperty("message", "The aerolinea with the given id was not found"); 
  });

  it('associateAeropuertosAerolinea should throw an exception for an invalid aeropuerto', async () => {
    const newAeropuerto: AeropuertoEntity = aeropuertosList[0];
    newAeropuerto.id = "0";

    await expect(()=> service.associateAeropuertosAerolinea(aerolinea.id, [newAeropuerto])).rejects.toHaveProperty("message", "The aeropuerto with the given id was not found"); 
  });

  it('deleteAeropuertoToAerolinea should remove an aeropuerto from a aerolinea', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    
    await service.deleteAeropuertoAerolinea(aerolinea.id, aeropuerto.id);

    const storedAerolinea: AerolineaEntity = await aerolineaRepository.findOne({where: {id: aerolinea.id}, relations: ["aeropuertos"]});
    const deletedAeropuerto: AeropuertoEntity = storedAerolinea.aeropuertos.find(a => a.id === aeropuerto.id);

    expect(deletedAeropuerto).toBeUndefined();

  });

  it('deleteAeropuertoToAerolinea should thrown an exception for an invalid aeropuerto', async () => {
    await expect(()=> service.deleteAeropuertoAerolinea(aerolinea.id, "0")).rejects.toHaveProperty("message", "The aeropuerto with the given id was not found"); 
  });

  it('deleteAeropuertoToAerolinea should thrown an exception for an invalid aerolinea', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    await expect(()=> service.deleteAeropuertoAerolinea("0", aeropuerto.id)).rejects.toHaveProperty("message", "The aerolinea with the given id was not found"); 
  });

  it('deleteAeropuertoToAerolinea should thrown an exception for an non asocciated aeropuerto', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.lorem.sentence(),
      codigo: "123",
      pais: faker.lorem.sentence(),
      ciudad: faker.lorem.sentence()
    });

    await expect(()=> service.deleteAeropuertoAerolinea(aerolinea.id, newAeropuerto.id)).rejects.toHaveProperty("message", "The aeropuerto with the given id is not associated to the aerolinea"); 
  }); 

});