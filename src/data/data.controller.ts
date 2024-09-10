import { Controller, Get, Post, Put, Delete, Body, Query, Param, BadRequestException } from '@nestjs/common';
import { DataService } from './data.service';

@Controller('v1/data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Get('paginated')
  async getPaginatedData(
    @Query('page') page: string,
    @Query('pageSize') pageSize: string
  ) {
    const pageNumber = parseInt(page, 10);
    const pageSizeNumber = parseInt(pageSize, 10);

    if (isNaN(pageNumber) || isNaN(pageSizeNumber)) {
      throw new BadRequestException('Parâmetros de página e tamanho da página devem ser números válidos');
    }

    return this.dataService.getPaginatedData(pageNumber, pageSizeNumber);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: any
  ) {
    const updatedData = await this.dataService.update(id, updateData);
    return updatedData;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.dataService.delete(id);
    return { message: 'Data deleted successfully' };
  }
}
