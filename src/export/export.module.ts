import { Module } from '@nestjs/common';
import { ExportService } from './export.service';
import { ExportController } from './export.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [ExportService, PrismaService],
  controllers: [ExportController],
})
export class ExportModule {}
