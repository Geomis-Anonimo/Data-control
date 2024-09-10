import { Test, TestingModule } from '@nestjs/testing';
import { PermanentDataService } from './permanent-data.service';

describe('PermanentDataService', () => {
  let service: PermanentDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PermanentDataService],
    }).compile();

    service = module.get<PermanentDataService>(PermanentDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
