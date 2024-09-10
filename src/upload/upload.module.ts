import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Importe o PrismaModule

@Module({
  imports: [PrismaModule],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
