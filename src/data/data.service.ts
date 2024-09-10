import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DataService {
  constructor(private readonly prisma: PrismaService) {}

  async getPaginatedData(page: number, pageSize: number): Promise<any> {
    if (page < 1 || pageSize < 1) {
      throw new BadRequestException('Número da página e tamanho da página devem ser maiores que 0');
    }

    const skip = (page - 1) * pageSize;

    try {
      const [data, total] = await Promise.all([
        this.prisma.paymentData.findMany({
          skip: skip,
          take: pageSize,
        }),
        this.prisma.paymentData.count(),
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
    const data = await this.prisma.paymentData.findFirst({
      where: { id },
    });

    if (!data) {
      throw new NotFoundException(`Dado com Id ${id} não encontrado`);
    }

    return data;
  }

  async update(id: string, updateData: any): Promise<any> {
    const existingData = await this.prisma.paymentData.findFirst({
      where: { id },
    });

    if (!existingData) {
      throw new NotFoundException(`Dado com Id ${id} não encontrado`);
    }

    return this.prisma.paymentData.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string): Promise<any> {
    const existingData = await this.prisma.paymentData.findFirst({
      where: { id },
    });

    if (!existingData) {
      throw new NotFoundException(`Dado com Id ${id} não encontrado`);
    }

    return this.prisma.paymentData.delete({
      where: { id },
    });
  }
}