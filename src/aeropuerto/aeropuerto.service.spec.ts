import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AeropuertoEntity } from './aeropuerto.entity';
import { AeropuertoService } from './aeropuerto.service';
import { faker } from '@faker-js/faker';

describe('AeropuertoService', () => {
 let service: AeropuertoService;
 let repository: Repository<AeropuertoEntity>;
 let aeropuertosList: AeropuertoEntity[];

 beforeEach(async () => {
   const module: TestingModule = await Test.createTestingModule({
     imports: [...TypeOrmTestingConfig()],
     providers: [AeropuertoService],
   }).compile();

   service = module.get<AeropuertoService>(AeropuertoService);
   repository = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));
   await seedDatabase();
 },1000);
  
 const seedDatabase = async () => {
  repository.clear();
  aeropuertosList = [];
  for(let i = 0; i < 5; i++){
      const aeropuerto: AeropuertoEntity = await repository.save({
      nombre: faker.lorem.sentence(), 
      codigo: "123", 
      pais: faker.lorem.sentence(), 
      ciudad: faker.lorem.sentence()})
      aeropuertosList.push(aeropuerto);
  }
}
  
it('should be defined', () => {
  expect(service).toBeDefined();
}, 10000);

it('findAll should return all aeropuertos', async () => {
  const aeropuertos: AeropuertoEntity[] = await service.findAll();
  expect(aeropuertos).not.toBeNull();
  expect(aeropuertos).toHaveLength(aeropuertosList.length);
});

it('findOne should return a aeropuerto by id', async () => {
  const storedAeropuerto: AeropuertoEntity = aeropuertosList[0];
  const aeropuerto: AeropuertoEntity = await service.findOne(storedAeropuerto.id);
  expect(aeropuerto).not.toBeNull();
  expect(aeropuerto.nombre).toEqual(storedAeropuerto.nombre)
  expect(aeropuerto.codigo).toEqual(storedAeropuerto.codigo)
  expect(aeropuerto.pais).toEqual(storedAeropuerto.pais)
  expect(aeropuerto.ciudad).toEqual(storedAeropuerto.ciudad)
});

it('findOne should throw an exception for an invalid aeropuerto', async () => {
  await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The aeropuerto with the given id was not found")
});

it('create should return a new aeropuerto', async () => {
  const aeropuerto: AeropuertoEntity = {
    id: "",
    nombre: faker.lorem.sentence(), 
    codigo: "123", 
    pais: faker.lorem.sentence(), 
    ciudad: faker.lorem.sentence(), 
    aerolineas: []
  }

  const newAeropuerto: AeropuertoEntity = await service.create(aeropuerto);
  expect(newAeropuerto).not.toBeNull();

  const storedAeropuerto: AeropuertoEntity = await repository.findOne({where: {id: newAeropuerto.id}})
  expect(storedAeropuerto).not.toBeNull();
  expect(storedAeropuerto.nombre).toEqual(newAeropuerto.nombre)
  expect(storedAeropuerto.codigo).toEqual(newAeropuerto.codigo)
  expect(storedAeropuerto.pais).toEqual(newAeropuerto.pais)
  expect(storedAeropuerto.ciudad).toEqual(newAeropuerto.ciudad)
});

it('update should modify a aeropuerto', async () => {
  const aeropuerto: AeropuertoEntity = aeropuertosList[0];
  aeropuerto.nombre = "Nuevo nombre";
  aeropuerto.codigo = "123";

  const updatedAeropuerto: AeropuertoEntity = await service.update(aeropuerto.id, aeropuerto);
  expect(updatedAeropuerto).not.toBeNull();

  const storedAeropuerto: AeropuertoEntity = await repository.findOne({ where: { id: aeropuerto.id } })
  expect(storedAeropuerto).not.toBeNull();
  expect(storedAeropuerto.nombre).toEqual(aeropuerto.nombre)
  expect(storedAeropuerto.codigo).toEqual(aeropuerto.codigo)
});

it('update should throw an exception for an invalid aeropuerto', async () => {
  let aeropuerto: AeropuertoEntity = aeropuertosList[0];
  aeropuerto = {
    ...aeropuerto, nombre: "Nuevo nombre", codigo: "Nuevo codigo"
  }
  await expect(() => service.update("0", aeropuerto)).rejects.toHaveProperty("message", "The aeropuerto with the given id was not found")
});

it('delete should remove a aeropuerto', async () => {
  const aeropuerto: AeropuertoEntity = aeropuertosList[0];
  await service.delete(aeropuerto.id);

  const deletedAeropuerto: AeropuertoEntity = await repository.findOne({ where: { id: aeropuerto.id } })
  expect(deletedAeropuerto).toBeNull();
});

it('delete should throw an exception for an invalid aeropuerto', async () => {
  const aeropuerto: AeropuertoEntity = aeropuertosList[0];
  // await service.delete(aeropuerto.id);
  await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The aeropuerto with the given id was not found")
});

});