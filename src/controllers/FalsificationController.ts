import { Body, Controller } from '@nestjs/common';
import { FalsificationRequestTO } from '../dtos/falsification/FalsificationRequestTO';
import { FalsificationResponseTO } from '../dtos/falsification/FalsificationResponseTO';

@Controller('falsification')
export class FalsificationController {
  async analyze(
    @Body() params: FalsificationRequestTO,
  ): Promise<FalsificationResponseTO> {
    const { text } = params;

    console.log('Request text: ', text);

    return {
      isFake: false,
      confidenceScore: 0.9,
      modelInfo: 'OpenAI GPT-3.5 Turbo',
    };
  }
}
