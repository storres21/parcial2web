/* eslint-disable prettier/prettier */
import {IsNotEmpty, IsString, IsUrl} from 'class-validator';
export class AerolineaDto {

 @IsString()
 @IsNotEmpty()
 readonly nombre: string;
 
 @IsString()
 @IsNotEmpty()
 readonly descripcion: string;
 
 @IsString()
 @IsNotEmpty()
 readonly fechaFundacion: Date;
 
 @IsString()
 @IsNotEmpty()
 readonly paginaWeb: string;
 
}
