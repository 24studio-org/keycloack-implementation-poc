import { Test, TestingModule } from '@nestjs/testing';
import { KeycloackService } from './keycloack.service';

describe('KeycloackService', () => {
  let service: KeycloackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KeycloackService],
    }).compile();

    service = module.get<KeycloackService>(KeycloackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
