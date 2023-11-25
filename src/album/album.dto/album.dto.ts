import {IsDate, IsNotEmpty, IsString, IsUrl} from 'class-validator';
export class AlbumDto {

 @IsString()
 @IsNotEmpty()
 readonly nombre: string;
 
 @IsUrl()
 @IsNotEmpty()
 readonly caratula: string;

 @IsDate()
 @IsNotEmpty()
 readonly fechaLanzamiento: Date;
 
 @IsString()
 @IsNotEmpty()
 readonly descripcion: string;
 
}