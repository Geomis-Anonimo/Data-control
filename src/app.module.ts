import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadModule } from './upload/upload.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { DataService } from './data/data.service';
import { DataController } from './data/data.controller';
import { DataModule } from './data/data.module';
import { PermanentDataModule } from './permanent-data/permanent-data.module';
import { ExportService } from './export/export.service';
import { ExportModule } from './export/export.module';

@Module({
  imports: [UploadModule, PrismaModule, DataModule, PermanentDataModule, ExportModule],
  controllers: [AppController, DataController],
  providers: [AppService, PrismaService, DataService, ExportService],
})
export class AppModule {}
