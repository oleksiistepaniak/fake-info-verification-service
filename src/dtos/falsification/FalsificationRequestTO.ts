import { IsString, MinLength } from 'class-validator';
import { IsEnglishAndAllowedChars } from '../../decorators/validation/IsEnglishAndAllowedCharsConstraint';

export class FalsificationRequestTO {
  @IsString({ message: 'invalid_text_type' })
  @MinLength(50, { message: 'invalid_text_length' })
  @IsEnglishAndAllowedChars()
  text: string;
}
