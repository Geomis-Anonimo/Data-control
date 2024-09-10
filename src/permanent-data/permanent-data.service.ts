import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PermanentDataService {
  constructor(private readonly prisma: PrismaService) {}

  async confirmData(ids: string[]): Promise<any> {
    if (!ids.length) {
      throw new BadRequestException('Nenhum ID fornecido');
    }

    const dataToConfirm = await this.prisma.paymentData.findMany({
      where: {
        id: { in: ids },
      },
    });

    if (!dataToConfirm.length) {
      throw new BadRequestException('Nenhum dado encontrado para os IDs fornecidos');
    }
    const dataToSave = dataToConfirm.map(({ updatedAt, ...rest }) => rest);

    await this.prisma.permanentData.createMany({
      data: dataToSave,
    });

    return { message: 'Dados confirmados e salvos como permanentes com sucesso' };
  }
}
