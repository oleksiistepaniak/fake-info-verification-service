import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FalsificationRequestTO } from '../../dtos/falsification/FalsificationRequestTO';
import { FalsificationResponseTO } from '../../dtos/falsification/FalsificationResponseTO';
import { FalsificationService } from '../../services/falsification/FalsificationService';
import { ApiHelper } from '../../helpers/ApiHelper';
import { JwtGuard } from '../../guards/JwtGuard';

@Controller('falsification')
@UsePipes(new ValidationPipe())
@UseGuards(JwtGuard)
export class FalsificationController {
  constructor(private readonly falsificationService: FalsificationService) {}

  @Post('/analyze')
  @HttpCode(HttpStatus.OK)
  async analyze(
    @Body() params: FalsificationRequestTO,
  ): Promise<FalsificationResponseTO> {
    const text = params.text.trim();

    ApiHelper.apiCheck(text.length > 0, 'invalid_text_length');

    const result = await this.falsificationService.detectFakeNews(text);
    return result;
  }
}
