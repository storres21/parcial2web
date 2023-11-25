import { Type } from 'class-transformer';
import {IsDate, IsNotEmpty, IsString, IsUrl} from 'class-validator';
export class AlbumDto {

    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsUrl()
    @IsNotEmpty()
    readonly caratula: string;

    @IsString()
    @IsNotEmpty()
    readonly descripcion: string;

    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    readonly fechaLanzamiento: Date;
}
 
    
 

