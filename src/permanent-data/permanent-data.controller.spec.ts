import { Test, TestingModule } from '@nestjs/testing';
import { PermanentDataController } from './permanent-data.controller';

describe('PermanentDataController', () => {
  let controller: PermanentDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermanentDataController],
    }).compile();

    controller = module.get<PermanentDataController>(PermanentDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
