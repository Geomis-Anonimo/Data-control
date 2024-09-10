import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
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

  async getPaginatedData(page: number, pageSize: number): Promise<any> {
    if (page < 1 || pageSize < 1) {
      throw new BadRequestException('Número da página e tamanho da página devem ser maiores que 0');
    }

    const skip = (page - 1) * pageSize;

    try {
      const [data, total] = await Promise.all([
        this.prisma.permanentData.findMany({
          skip: skip,
          take: pageSize,
        }),
        this.prisma.permanentData.count(),
      ]);

      return {
        data,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      };
    } catch (error) {
      throw new BadRequestException('Erro ao buscar dados: ' + error.message);
    }
  }

  async findById(id: string): Promise<any> {
    const data = await this.prisma.permanentData.findFirst({
      where: { id },
    });

    if (!data) {
      throw new NotFoundException(`Dado com Id ${id} não encontrado`);
    }

    return data;
  }
}
