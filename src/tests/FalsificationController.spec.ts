import { Test, TestingModule } from '@nestjs/testing';
import { FalsificationController } from '../controllers/FalsificationController';
import { FalsificationResponseTO } from '../dtos/falsification/FalsificationResponseTO';

describe('FalsificationController.test', () => {
  let falsificationController: FalsificationController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FalsificationController],
      providers: [],
    }).compile();

    falsificationController = app.get<FalsificationController>(
      FalsificationController,
    );
  });

  it('should return a test result', async () => {
    const result = await falsificationController.analyze({ text: 's' });

    expect(result).toBeDefined();
    expect(result).toHaveProperty('isFake');
    expect(result).toHaveProperty('confidenceScore');
    expect(result).toHaveProperty('modelInfo');
    expect(result).toEqual<FalsificationResponseTO>({
      isFake: false,
      confidenceScore: 0.9,
      modelInfo: 'OpenAI GPT-3.5 Turbo',
    });
  });
});
