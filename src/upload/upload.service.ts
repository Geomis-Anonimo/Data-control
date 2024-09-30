import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from 'src/prisma/prisma.service';
import * as ExcelJS from 'exceljs'; // Importando ExcelJS para leitura em stream

@Injectable()
export class UploadService {
  private readonly uploadDir = path.join(__dirname, '..', 'uploads');
  private readonly batchSize = 100; // Define o tamanho do batch

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

    // Salva o arquivo no diretório de uploads
    fs.writeFileSync(filePath, file.buffer);

    try {
      if (fileExtension === '.txt') {
        await this.processTextFile(filePath);
      } else if (fileExtension === '.xlsx') {
        await this.processExcelFile(filePath); // Lendo Excel via stream
      } else {
        throw new BadRequestException('Tipo de arquivo não permitido');
      }
    } finally {
      fs.unlinkSync(filePath); // Remove o arquivo após o processamento
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

  // Novo método para processar arquivos Excel com leitura em stream
  private async processExcelFile(filePath: string): Promise<void> {
    try {
      const workbook = new ExcelJS.Workbook();
      const stream = fs.createReadStream(filePath); // Lê o arquivo como stream

      // Lê o arquivo Excel em stream
      await workbook.xlsx.read(stream);
      const worksheet = workbook.getWorksheet(1); // Pega a primeira aba (sheet)

      const batch = [];

      // Processa cada linha da planilha Excel
      worksheet.eachRow({ includeEmpty: false }, async (row, rowNumber) => {
        // Leitura dos dados da linha
        const [name = '', age = '', address = '', cpf = '', paidAmount = 0, birthDate = ''] = row.values;

        const formattedRow = {
          name: name as string,
          age: age as string,
          address: address as string,
          cpf: cpf as string,
          paidAmount: parseFloat(paidAmount as string) || 0,
          birthDate: birthDate as string,
        };

        // Adiciona ao batch
        batch.push(formattedRow);

        // Quando o batch atingir o tamanho definido, salva no banco
        if (batch.length >= this.batchSize) {
          await this.prisma.paymentData.createMany({
            data: batch as any[],
          });

          // Limpa o batch após salvar no banco
          batch.length = 0;
        }
      });

      // Salva o restante dos dados se houver algo no batch
      if (batch.length > 0) {
        await this.prisma.paymentData.createMany({
          data: batch as any[],
        });
      }
    } catch (error) {
      throw new BadRequestException('Erro ao processar arquivo de Excel: ' + error.message);
    }
  }
}
