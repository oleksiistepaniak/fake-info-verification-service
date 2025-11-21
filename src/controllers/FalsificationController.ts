import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FalsificationRequestTO } from '../dtos/falsification/FalsificationRequestTO';
import { FalsificationResponseTO } from '../dtos/falsification/FalsificationResponseTO';

@Controller('falsification')
@UsePipes(new ValidationPipe())
export class FalsificationController {
  @Post('/analyze')
  @HttpCode(HttpStatus.OK)
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
