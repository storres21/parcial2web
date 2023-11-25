
import {IsNotEmpty, IsNumber, IsString, IsUrl} from 'class-validator';
export class TrackDto {

 @IsString()
 @IsNotEmpty()
 readonly nombre: string;
 
 @IsNumber()
 @IsNotEmpty()
 readonly duracion: number;
 

}
