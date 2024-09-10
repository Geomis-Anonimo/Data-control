import { Module } from '@nestjs/common';
import { PermanentDataController } from './permanent-data.controller';
import { PermanentDataService } from './permanent-data.service';
import { PrismaModule } from '../prisma/prisma.module'; // Ajuste o caminho conforme necessário

@Module({
  imports: [PrismaModule], // Adicione o PrismaModule aqui
  controllers: [PermanentDataController],
  providers: [PermanentDataService],
})
export class PermanentDataModule {}
