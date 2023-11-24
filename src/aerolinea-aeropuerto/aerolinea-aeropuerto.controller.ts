import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { AeropuertoDto } from 'src/aeropuerto/aeropuerto.dto/aeropuerto.dto';
import { plainToInstance } from 'class-transformer';
import { AeropuertoEntity } from 'src/aeropuerto/aeropuerto.entity';

@Controller('aerolinea')
@UseInterceptors(BusinessErrorsInterceptor)
export class AerolineaAeropuertoController {
    constructor(private readonly aerolineaAeropuertoService: AerolineaAeropuertoService) {}
    @Post(':aerolineaId/aeropuertos/:aeropuertoId')
    async addAeropuertoAerolinea(@Param('aerolineaId') aerolineaId: string, @Param('aeropuertoId') aeropuertoId: string) {
        return await this.aerolineaAeropuertoService.addAeropuertoAerolinea(aerolineaId, aeropuertoId);
    }
    @Get(':aerolineaId/aeropuertos/:aeropuertoId')
    async findAeropuertoByAerolineaIdAeropuertoId(@Param('aerolineaId') aerolineaId: string, @Param('aeropuertoId') aeropuertoId: string) {
        return await this.aerolineaAeropuertoService.findAeropuertoByAerolineaIdAeropuertoId(aerolineaId, aeropuertoId);
    }
    @Get(':aerolineaId/aeropuertos')
    async findAeropuertosByAerolineaId(@Param('aerolineaId') aerolineaId: string) {
        return await this.aerolineaAeropuertoService.findAeropuertosByAerolineaId(aerolineaId);
    }
    @Put(':aerolineaId/aeropuertos')
    async associateAeropuertosAerolinea(@Body() aeropuertosDTO: AeropuertoDto[], @Param('aerolineaId') aerolineaId: string) {
        const aeropuertos = plainToInstance(AeropuertoEntity, aeropuertosDTO);
        return await this.aerolineaAeropuertoService.associateAeropuertosAerolinea(aerolineaId, aeropuertos);
    }
    @Delete(':aerolineaId/aeropuertos/:aeropuertoId')
    @HttpCode(204)
    async deleteAeropuertoAerolinea(@Param('aerolineaId') aerolineaId: string, @Param('aeropuertoId') aeropuertoId: string) {
        return await this.aerolineaAeropuertoService.deleteAeropuertoAerolinea(aerolineaId, aeropuertoId);
    }
}
