import { Controller, Post, Body, Get, Query, BadRequestException, Param } from '@nestjs/common';
import { PermanentDataService } from './permanent-data.service';

@Controller('v1/permanent-data')
export class PermanentDataController {
  constructor(private readonly permanentDataService: PermanentDataService) {}

  @Post()
  async confirmData(@Body('ids') ids: string[]) {
    return this.permanentDataService.confirmData(ids);
  }

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

    return this.permanentDataService.getPaginatedData(pageNumber, pageSizeNumber);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const getById = await this.permanentDataService.findById(id);
    return getById;
  }
}
