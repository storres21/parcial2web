/* eslint-disable prettier/prettier */
import {IsNotEmpty, IsString, IsUrl} from 'class-validator';
export class AeropuertoDto {

 @IsString()
 @IsNotEmpty()
 readonly nombre: string;
 
 @IsString()
 @IsNotEmpty()
 readonly codigo: string;
 
 @IsString()
 @IsNotEmpty()
 readonly pais: string;
 
 @IsString()
 @IsNotEmpty()
 readonly ciudad: string;
 
}
/* archivo: src/museum/museum.dto.ts */