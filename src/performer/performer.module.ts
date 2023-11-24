import { Module } from '@nestjs/common';
// import { PerformerService } from './performer.service';
import { PerformerEntity } from './performer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { PerformerController } from './performer.controller';
import { PerformerService } from './performer.service';

@Module({
    imports: [TypeOrmModule.forFeature([PerformerEntity])],
    providers: [PerformerService],
    // providers: [PerformerService],
    // controllers: [PerformerController]

})
export class PerformerModule {}
