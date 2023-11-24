import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, JoinTable } from 'typeorm';
import { AlbumEntity } from '../album/album.entity';

@Entity()
export class TrackEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    duracion: number;


    @ManyToOne(() => AlbumEntity, album => album.tracks)
    album: AlbumEntity;

}