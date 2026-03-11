import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';
import { MailService } from '../../shared/mail/mail.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async create(data: any) {
    const orderNumber = `#${Math.floor(1000 + Math.random() * 9000)}`;

    const user = await this.prisma.user.findUnique({
      where: { email: data.customerEmail },
    });

    if (!user) throw new Error('Usuário não encontrado');

    // 1. Criamos o pedido e salvamos na constante 'newOrder'
    const newOrder = await this.prisma.order.create({
      data: {
        orderNumber,
        userId: user.id,
        total: data.total,
        status: OrderStatus.AGUARDANDO_PAGAMENTO,
        paymentMethod: data.paymentMethod,
        carrier: data.carrier,
        customerEmail: data.customerEmail.toLowerCase().trim(),
        customerName: user.name,
        customerCPF: user.cpf,
        customerPhone: user.phone,
        address: data.address,
        items: data.items,
      },
    });

    // LOG: Disparar e-mails de nova venda
    this.mailService.sendOrderConfirmation(newOrder).catch(e => console.log('Mail Fail:', e));
    this.mailService.notifyAdminNewSale(newOrder).catch(e => console.log('Mail Fail:', e));

    return newOrder;
  }

  async findAllAdmin() {
    return this.prisma.order.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, data: { status: any; trackingCode?: string }) {
    console.log(`🛠️ Recebido pedido de mudança de status para ID: ${id}`);
    console.log(`🏷️ Novo status solicitado: ${data.status}`);

    try {
      const updatedOrder = await this.prisma.order.update({
        where: { id: id }, // Onde o ID bate com o UUID do banco
        data: {
          status: data.status,
          trackingCode: data.trackingCode,
        },
      });

      console.log(`✅ Banco atualizado! Novo status: ${updatedOrder.status}`);

      // Notifica o cliente por e-mail (não bloqueia a resposta pro admin)
      this.mailService.sendStatusUpdate(updatedOrder).catch(console.error);

      return updatedOrder;
    } catch (error) {
      console.error("❌ ERRO AO ATUALIZAR STATUS NO BANCO:", error.message);
      throw error;
    }
  }
  async remove(id: string) {
    return this.prisma.order.delete({
      where: { id: id },
    });
  }
}