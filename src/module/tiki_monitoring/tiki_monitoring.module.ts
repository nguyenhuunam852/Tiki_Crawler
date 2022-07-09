import { Module } from '@nestjs/common';
import { Local_Storage_Management } from 'src/utils/local_storage';
import { tikiMonitoringService } from './tiki_monitoring.service';

@Module({
    imports: [],
    controllers: [],
    providers: [tikiMonitoringService, Local_Storage_Management],
    exports: [tikiMonitoringService]
})
export class tikiMonitoringModule { }
