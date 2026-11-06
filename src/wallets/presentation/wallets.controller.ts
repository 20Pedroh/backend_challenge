
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

@Controller('wallets')
export class WalletsController {
  constructor(
    private readonly createWalletUseCase: CreateWalletUseCase,
    private readonly getWalletUseCase: GetWalletUseCase,
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
}
