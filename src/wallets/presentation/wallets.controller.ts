
import {
  Get,
  Param,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';

import { CreateWalletUseCase } from '../application/use-cases/create-wallet.use-case.js';
import { GetWalletUseCase } from '../application/use-cases/get-wallet.use-case.js';
import { CreateWalletDto } from './dto/create-wallet.dto.js';
import { CreditWalletUseCase } from '../application/use-cases/credit-wallet.use-case.js';
import { CreditWalletDto } from './dto/credit-wallet.dto.js';

@Controller('wallets')
export class WalletsController {
  constructor(
    private readonly createWalletUseCase: CreateWalletUseCase,
    private readonly getWalletUseCase: GetWalletUseCase,
    private readonly creditWalletUseCase: CreditWalletUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateWalletDto) {
    const wallet = await this.createWalletUseCase.execute(
      dto.playerId,
      dto.currency,
    );

    return {
      id: wallet.id,
      playerId: wallet.playerId,
      currency: wallet.balance.currency,
      balance: wallet.balance.toString(),
      version: wallet.version,
    };
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.getWalletUseCase.execute(id);
  }

  @Post(':id/credits')
  async credit(
    @Param('id') id: string,
    @Body() dto: CreditWalletDto,
  ) {
    return this.creditWalletUseCase.execute(
      id,
      dto.amount,
      dto.currency,
    );
  }
}
