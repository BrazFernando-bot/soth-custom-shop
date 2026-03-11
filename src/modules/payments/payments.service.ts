import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { MailService } from '../../shared/mail/mail.service'; // <--- Garante o import do robô de email

@Injectable()
export class PaymentsService {
  private client: MercadoPagoConfig;

  constructor(
    private prisma: PrismaService,
    private mailService: MailService, // <--- Injetando o MailService
  ) {
    this.client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN!,
    });
  }

  // 1. GERA O LINK DE PAGAMENTO (VALOR DE R$ 1,00 PARA TESTE)
  // src/modules/payments/payments.service.ts

// src/modules/payments/payments.service.ts

async createPreference(orderId: string) {
  const order = await this.prisma.order.findUnique({
    where: { id: orderId },
    include: { user: true },
  });

  if (!order) throw new NotFoundException('Pedido não encontrado');

  const preference = new Preference(this.client);
  
  // O valor total no banco já inclui tudo (preço dos itens + frete que você calculou antes)
  // Certifique-se de que order.total é um número.
  const totalAmount = Number(order.total); 

  try {
    const response = await preference.create({
      body: {
        items: [
          {
            id: order.id,
            title: `Pedido SOTH #${order.orderNumber}`,
            unit_price: Number(order.total), // <--- AQUI ESTÁ O PREÇO REAL
            quantity: 1,
            currency_id: 'BRL',
          },
        ],
        payer: {
          name: order.user.name,
          email: order.user.email,
        },
        external_reference: order.id,
        back_urls: {
          success: `${process.env.FRONTEND_URL}/dashboard`,
          failure: `${process.env.FRONTEND_URL}/cart`,
          pending: `${process.env.FRONTEND_URL}/dashboard`,
        },
        // O Mercado Pago avisa o seu backend quando o pagamento for aprovado
        notification_url: `${process.env.BACKEND_URL}/api/v1/payments/webhook`,
        payment_methods: {
          // Se quiser habilitar cartão também, remova o campo "default_payment_method_id"
          // Caso queira apenas PIX, mantenha o que você já tinha.
        },
      },
    });

    return { initPoint: response.init_point };
  } catch (error) {
    console.error("❌ ERRO MERCADO PAGO:", error);
    throw error;
  }
}

  // 2. PROCESSA O AVISO DO PAGAMENTO (ATUALIZA STATUS E DISPARA EMAIL)
  async handleWebhook(body: any, query: any) {
    const paymentId = query['data.id'] || body.data?.id;

    if (paymentId) {
      try {
        const payment = new Payment(this.client);
        const detail = await payment.get({ id: paymentId });

        if (detail.status === 'approved') {
          const orderId = detail.external_reference;
          const order = await this.prisma.order.findUnique({ where: { id: orderId } });

          if (order) {
            // Lógica para separar FABRICAÇÃO de ENVIO
            const items = order.items as any[];
            const isCustom = items.some(it => it.category === 'BAGS' || it.category === 'CASES' || it.category === 'CUSTOM BAG');
            const nextStatus = isCustom ? 'AGUARDANDO_FABRICACAO' : 'AGUARDANDO_ENVIO';

            // Atualiza o pedido no banco de dados
            const updatedOrder = await this.prisma.order.update({
              where: { id: orderId },
              data: { 
                status: nextStatus as any,
                paymentMethod: detail.payment_method_id
              },
            });

            console.log(`✅ SUCESSO: Pedido ${order.orderNumber} aprovado e movido para ${nextStatus}`);

            // ENVIA E-MAIL AUTOMÁTICO DE CONFIRMAÇÃO DE PAGAMENTO
            this.mailService.sendStatusUpdate(updatedOrder).catch(e => console.error("Falha ao enviar e-mail:", e));
          }
        }
      } catch (error) {
        console.error("Erro Webhook:", error.message);
      }
    }
    return { received: true };
  }
}