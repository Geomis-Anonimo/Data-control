import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Workbook } from 'exceljs';
import * as fs from 'fs';
import { PaymentData } from '@prisma/client';

@Injectable()
export class UploadService {
  constructor(private readonly prisma: PrismaService) {}

  async readExcelFile(filePath: string) {
    const workbook = new Workbook();
    const stream = fs.createReadStream(filePath);

    await workbook.xlsx.read(stream);
    const worksheet = workbook.getWorksheet(1); // Primeira aba do Excel

    const batchSize = 100; // Tamanho do lote
    let batch: any[] = [];

    // Usando loop manual para processar cada linha
    for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
      const row = worksheet.getRow(rowNumber);

      // Mapear os valores da linha para o formato esperado pelo banco
      const paymentData = {
        name: row.getCell(1).value.toString().trim().substring(0, 15),
        age: row.getCell(2).value.toString().trim().substring(0, 4),
        address: row.getCell(3).value.toString().trim().substring(0, 34),
        cpf: row.getCell(4).value.toString().trim().substring(0, 11),
        paidAmount: parseFloat(row.getCell(5).value.toString().trim()),
        birthDate: row.getCell(6).value.toString().trim().substring(0, 8),
      };

      // Adicionar dados ao lote
      batch.push(paymentData);

      // Inserir o lote quando atingir o tamanho do batch
      if (batch.length >= batchSize) {
        try {
          await this.prisma.paymentData.createMany({ data: batch });
          console.log(`Inseridos ${batch.length} registros`);
        } catch (error) {
          console.error(`Erro ao inserir em lote: ${error.message}`);
        }
        batch = []; // Limpar o lote após inserção
      }
    }

    // Inserir o restante dos dados (último lote)
    if (batch.length > 0) {
      try {
        await this.prisma.paymentData.createMany({ data: batch });
        console.log(`Inseridos os últimos ${batch.length} registros`);
      } catch (error) {
        console.error(`Erro ao inserir o último lote: ${error.message}`);
      }
    }

    // Remover o arquivo após o processamento
    try {
      await fs.promises.unlink(filePath);
      console.log(`Arquivo ${filePath} removido com sucesso.`);
    } catch (error) {
      console.error(`Erro ao remover o arquivo ${filePath}: ${error.message}`);
    }
  }
}
