/* eslint-disable prettier/prettier */
/* archivo src/shared/testing-utils/typeorm-testing-config.ts*/
import { TypeOrmModule } from '@nestjs/typeorm';
import { AerolineaEntity } from '../../aerolinea/aerolinea.entity';
import { AeropuertoEntity } from '../../aeropuerto/aeropuerto.entity';

export const TypeOrmTestingConfig = () => [
 TypeOrmModule.forRoot({
   type: 'sqlite',
   database: ':memory:',
   dropSchema: true,
   entities: [AerolineaEntity, AeropuertoEntity],
   synchronize: true,
   keepConnectionAlive: true
 }),
 TypeOrmModule.forFeature([AerolineaEntity, AeropuertoEntity]),
];
/* archivo src/shared/testing-utils/typeorm-testing-config.ts*/