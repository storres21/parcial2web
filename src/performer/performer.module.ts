import { Module } from '@nestjs/common';
// import { PerformerService } from './performer.service';
import { PerformerEntity } from './performer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { PerformerController } from './performer.controller';
import { PerformerService } from './performer.service';
import { PerformerController } from './performer.controller';

@Module({
    imports: [TypeOrmModule.forFeature([PerformerEntity])],
    providers: [PerformerService],
    controllers: [PerformerController],
    // providers: [PerformerService],
    // controllers: [PerformerController]

})
export class PerformerModule {}
