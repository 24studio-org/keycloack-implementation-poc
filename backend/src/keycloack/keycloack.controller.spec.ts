import { Test, TestingModule } from '@nestjs/testing';
import { KeycloackController } from './keycloack.controller';

describe('KeycloackController', () => {
  let controller: KeycloackController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KeycloackController],
    }).compile();

    controller = module.get<KeycloackController>(KeycloackController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
