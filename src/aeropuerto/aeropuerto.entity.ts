import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';

@Entity()
export class AeropuertoEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    codigo: string;

    @Column()
    pais: string;

    @Column()
    ciudad: string;

    @ManyToMany(() => AerolineaEntity, aerolinea => aerolinea.aeropuertos)
    @JoinTable()
    aerolineas: AerolineaEntity[];


}
