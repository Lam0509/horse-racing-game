import { Test, TestingModule } from '@nestjs/testing';
import { HorseraceController } from './horserace.controller';

describe('HorseraceController', () => {
  let controller: HorseraceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HorseraceController],
    }).compile();

    controller = module.get<HorseraceController>(HorseraceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
