import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from 'src/prisma/prisma.service';
import * as XLSX from 'xlsx';

@Injectable()
export class UploadService {
  private readonly uploadDir = path.join(__dirname, '..', 'uploads');
  private readonly batchSize = 100;

  constructor(private readonly prisma: PrismaService) {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir);
    }
  }

  async processFile(file: Express.Multer.File): Promise<any> {
    if (!file || !file.buffer || !file.originalname) {
      throw new BadRequestException('Nenhum arquivo enviado ou dados do arquivo estão faltando');
    }

    const fileExtension = path.extname(file.originalname).toLowerCase();
    const filePath = path.join(this.uploadDir, file.originalname);

    fs.writeFileSync(filePath, file.buffer);

    try {
      if (fileExtension === '.txt') {
        await this.processTextFile(filePath);
      } else if (fileExtension === '.xlsx') {
        await this.processExcelFile(filePath);
      } else {
        throw new BadRequestException('Tipo de arquivo não permitido');
      }
    } finally {
      fs.unlinkSync(filePath);
    }
  }

  private async processTextFile(filePath: string): Promise<void> {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const lines = fileContent.split('\n');

      for (let i = 0; i < lines.length; i += this.batchSize) {
        const batch = lines.slice(i, i + this.batchSize);
        const data = batch.map(line => {
          if (line.trim()) {
            const name = line.substring(0, 15).trim() || '';
            const age = line.substring(15, 19).trim() || '';
            const address = line.substring(19, 53).trim() || '';
            const cpf = line.substring(53, 64).trim() || '';
            const paidAmount = parseFloat(line.substring(64, 80).trim()) || 0;
            const birthDate = line.substring(80, 88).trim() || '';

            return {
              name,
              age,
              address,
              cpf,
              paidAmount,
              birthDate,
            };
          }
          return null;
        }).filter(row => row !== null);

        await this.prisma.paymentData.createMany({
          data: data as any[],
        });
      }
    } catch (error) {
      throw new BadRequestException('Erro ao processar arquivo de Texto: ' + error.message);
    }
  }

  private async processExcelFile(filePath: string): Promise<void> {
    try {
      const workbook = XLSX.readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      if (!Array.isArray(data)) {
        throw new BadRequestException('Formato de dados inválido no arquivo Excel');
      }

      for (let i = 0; i < data.length; i += this.batchSize) {
        const batch = data.slice(i, i + this.batchSize);
        const formattedData = batch.map(row => {
          if (Array.isArray(row) && row.length) {
            const [name = '', age = '', address = '', cpf = '', paidAmount = 0, birthDate = ''] = row;

            return {
              name: name as string,
              age: age as string,
              address: address as string,
              cpf: cpf as string,
              paidAmount: parseFloat(paidAmount as string) || 0,
              birthDate: birthDate as string,
            };
          }
          return null;
        }).filter(row => row !== null);

        await this.prisma.paymentData.createMany({
          data: formattedData as any[],
        });
      }
    } catch (error) {
      throw new BadRequestException('Erro ao processar arquivo de Excel: ' + error.message);
    }
  }
}