import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { ExportService } from './export.service';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

@Controller('v1/export-data')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Post()
  async exportData(@Body('ids') ids: string[], @Res() res: Response) {
    const csvPath = await this.exportService.exportToCSV(ids);

    res.sendFile(path.resolve(csvPath), (err) => {
      if (err) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Erro ao exportar dados');
      } else {
        fs.unlinkSync(csvPath);
      }
    });
  }
}
