import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import * as csvWriter from 'csv-writer';

@Injectable()
export class ExportService {
  constructor(private readonly prisma: PrismaService) {}

  async exportToCSV(ids: string[]): Promise<string> {
    if (!ids.length) {
      throw new BadRequestException('Nenhum ID fornecido');
    }

    // Busca registros da tabela PermanentData
    const permanentData = await this.prisma.permanentData.findMany({
      where: {
        id: { in: ids },
      },
    });

    // Busca IDs que estão em PaymentData e não em PermanentData
    const paymentDataIds = ids.filter(id => !permanentData.find(data => data.id === id));
    const paymentData = await this.prisma.paymentData.findMany({
      where: {
        id: { in: paymentDataIds },
      },
    });

    // Combina os dados e adiciona o campo 'dado_permanente'
    const combinedData = [
      ...permanentData.map(data => ({
        ...data,
        dado_permanente: 'sim',
        data_de_insercao: data.createdAt.toISOString(), // Adiciona o campo de data
      })),
      ...paymentData.map(data => ({
        ...data,
        dado_permanente: 'não',
        data_de_insercao: data.createdAt.toISOString(), // Adiciona o campo de data
      })),
    ];

    // Configura o caminho para salvar o CSV
    const csvPath = path.join(__dirname, '..', '..', 'exported-data.csv');
    const writer = csvWriter.createObjectCsvWriter({
      path: csvPath,
      header: [
        { id: 'name', title: 'nome' },
        { id: 'age', title: 'idade' },
        { id: 'address', title: 'endereço' },
        { id: 'cpf', title: 'cpf' },
        { id: 'paidAmount', title: 'valor_pago' },
        { id: 'birthDate', title: 'data_nascimento' },
        { id: 'dado_permanente', title: 'dado_permanente' },
        { id: 'data_de_insercao', title: 'data_de_insercao' }, // Novo header para 'createdAt'
      ],
    });

    await writer.writeRecords(combinedData);

    return csvPath;
  }
}