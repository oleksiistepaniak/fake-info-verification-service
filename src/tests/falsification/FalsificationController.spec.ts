import { Test, TestingModule } from '@nestjs/testing';
import { FalsificationController } from '../../controllers/falsification/FalsificationController';
import { FalsificationResponseTO } from '../../dtos/falsification/FalsificationResponseTO';
import { FalsificationService } from '../../services/falsification/FalsificationService';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppDb } from '../../database/AppDatabase';
import { FalsificationRepository } from '../../repositories/falsification/FalsificationRepository';

describe('FalsificationController.test', () => {
  let falsificationController: FalsificationController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        await ConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
      controllers: [FalsificationController],
      providers: [
        AppDb,
        FalsificationService,
        ConfigService,
        FalsificationRepository,
      ],
    }).compile();

    falsificationController = app.get<FalsificationController>(
      FalsificationController,
    );
  });

  it('should throw an error if the text is empty', async () => {
    await expect(
      falsificationController.analyze({
        text: '          ',
      }),
    ).rejects.toThrow('invalid_text_length');
  });

  it('should return a test result', async () => {
    const result = await falsificationController.analyze({
      text: 'The earth is revolving around the sun.',
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty('isFake');
    expect(result).toHaveProperty('confidenceScore');
    expect(result).toHaveProperty('modelInfo');
    expect(result).toEqual<FalsificationResponseTO>({
      isFake: false,
      confidenceScore: 0.07667464017868042,
      modelInfo: 'hamzab/roberta-fake-news-classification',
    });
  }, 20000);
});
