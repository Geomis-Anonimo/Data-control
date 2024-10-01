// import { parentPort } from 'worker_threads';
// import { PrismaClient } from '@prisma/client';
// import * as fs from 'fs';
// import * as ExcelJS from 'exceljs';

// const prisma = new PrismaClient();

// parentPort?.on('message', async (filePath: string) => {
//   try {
//     const workbook = new ExcelJS.Workbook();
//     const stream = fs.createReadStream(filePath);

//     // Usa evento de stream 'close' para garantir que o arquivo foi lido completamente
//     stream.on('close', () => {
//       console.log(`Stream do arquivo ${filePath} foi fechado.`);
//     });

//     await workbook.xlsx.read(stream);
//     const worksheet = workbook.getWorksheet(1);

//     const batchSize = 100;
//     let batch: any[] = [];
//     let rowCount = 0;

//     worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
//       rowCount++; // Incrementar a contagem de linhas processadas
//       if (Array.isArray(row.values)) {
//         const [, name = '', age = '', address = '', cpf = '', paidAmount = 0, birthDate = ''] = row.values;

//         const formattedRow = {
//           name: name.toString().trim(),
//           age: age.toString().trim(),
//           address: address.toString().trim(),
//           cpf: cpf.toString().trim(),
//           paidAmount: parseFloat(paidAmount.toString()) || 0,
//           birthDate: birthDate.toString().trim(),
//         };

//         batch.push(formattedRow);

//         // Inserir dados no banco em batches
//         if (batch.length >= batchSize) {
//           prisma.paymentData.createMany({ data: batch })
//             .catch(err => console.error('Erro ao inserir batch no banco:', err.message));
//           batch = []; // Limpa o batch após a inserção
//         }
//       }
//     });

//     // Inserir batch final
//     if (batch.length > 0) {
//       prisma.paymentData.createMany({ data: batch })
//         .catch(err => console.error('Erro ao inserir batch final no banco:', err.message));
//     }

//     console.log(`Total de linhas processadas: ${rowCount}`);
//     parentPort?.postMessage('Upload complete');
//   } catch (error) {
//     parentPort?.postMessage(`Error: ${error.message}`);
//   } finally {
//     await prisma.$disconnect();
//   }
// });