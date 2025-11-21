import { IsBoolean, IsNumber, IsString, Max, Min } from 'class-validator';

export class FalsificationResponseTO {
  @IsBoolean()
  isFake: boolean;

  @IsNumber()
  @Min(0.0)
  @Max(1.0)
  confidenceScore: number;

  @IsString()
  modelInfo: string;
}
