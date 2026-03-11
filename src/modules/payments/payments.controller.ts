import { Controller, Post, Body, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // Rota que o Frontend chama para gerar o link da tela azul do Mercado Pago
  @Post('create-preference')
  async createPreference(@Query('orderId') orderId: string) {
    return this.paymentsService.createPreference(orderId);
  }

  // Rota ÚNICA de Webhook (Onde o Mercado Pago avisa que o cliente pagou)
  @Post('webhook')
  @HttpCode(HttpStatus.OK) // O Mercado Pago exige que respondamos 200 OK obrigatoriamente
  async handleWebhook(@Body() body: any, @Query() query: any) {
    // Passamos a bola para o Service processar os dados
    return this.paymentsService.handleWebhook(body, query);
  }
}