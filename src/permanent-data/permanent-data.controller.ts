import { Controller, Post, Body } from '@nestjs/common';
import { PermanentDataService } from './permanent-data.service';

@Controller('v1/permanent-data')
export class PermanentDataController {
  constructor(private readonly permanentDataService: PermanentDataService) {}

  @Post()
  async confirmData(@Body('ids') ids: string[]) {
    return this.permanentDataService.confirmData(ids);
  }
}
