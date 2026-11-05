
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class CreateWalletDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  playerId!: string;

  @IsString()
  @Matches(/^[A-Z]{3}$/)
  currency!: string;
}
