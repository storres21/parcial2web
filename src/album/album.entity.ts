import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, JoinTable, OneToMany } from 'typeorm';
import { PerformerEntity } from '../performer/performer.entity';
import { TrackEntity } from '../track/track.entity';

@Entity()
export class AlbumEntity {

 @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    caratula: string;

    @Column() 
    fechaLanzamiento: string;

    @Column()
    descripcion: string;

    @OneToMany(() => TrackEntity, track => track.album)
    tracks: TrackEntity[];

    @ManyToMany(() => PerformerEntity, performer => performer.albums)
    @JoinTable()
    performers: PerformerEntity[];


}
