import { Module, Global } from '@nestjs/common';
import { StorageService } from './storage.service';

@Global() // Global para não precisar importar em todo lugar
@Module({
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}