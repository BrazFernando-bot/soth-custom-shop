import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  // FORMATADOR DE SPECS (Transforma as medidas/cores em uma lista legível)
  private formatSpecs(specs: any) {
    if (!specs) return '';
    return Object.entries(specs)
      .map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`)
      .join('');
  }

  // 1. BOAS-VINDAS E CONFIRMAÇÃO DE PEDIDO (PARA O CLIENTE)
  async sendOrderConfirmation(order: any) {
    await this.mailerService.sendMail({
      to: order.customerEmail,
      subject: `🎸 Dossiê SOTH: Pedido ${order.orderNumber} Recebido`,
      html: `
        <div style="background-color: #000; color: #fff; padding: 40px; font-family: 'Helvetica', sans-serif; max-width: 600px; margin: auto; border: 2px solid #ff0000; border-radius: 20px;">
          <h1 style="color: #ff0000; text-align: center; text-transform: uppercase; letter-spacing: 5px;">SOTH CUSTOM</h1>
          <p style="font-size: 18px; text-align: center; color: #999;">EXCELÊNCIA EM PROTEÇÃO PARA SEU ARSENAL</p>
          <div style="background-color: #111; padding: 20px; border-radius: 10px; border: 1px solid #333; margin-top: 30px;">
            <p style="font-size: 16px;">Olá, <strong>${order.customerName}</strong>.</p>
            <p>Seja bem-vindo à elite. Seu pedido foi processado em nosso terminal e já está registrado sob o protocolo <strong>${order.orderNumber}</strong>.</p>
            <p>O próximo passo é a confirmação do investimento. Assim que aprovado, iniciaremos a artesania do seu projeto.</p>
            <h3 style="color: #ff0000; border-bottom: 1px solid #ff0000; padding-bottom: 10px;">RESUMO DO INVESTIMENTO</h3>
            <p>Total Geral: <strong style="font-size: 20px; color: #fff;">R$ ${Number(order.total).toLocaleString('pt-BR')}</strong></p>
            <p>Transportadora: ${order.carrier}</p>
          </div>
          <p style="text-align: center; font-size: 12px; color: #555; margin-top: 40px;">Obrigado por escolher a artesania brasileira de alta performance.</p>
        </div>
      `,
    });
  }

  // 2. RELATÓRIO TÉCNICO DE VENDA (PARA VOCÊ/ADMIN)
  async notifyAdminNewSale(order: any) {
    const itemsHtml = order.items.map((it: any) => `
      <div style="padding: 10px; border-bottom: 1px solid #333;">
        <strong>${it.name}</strong> - R$ ${it.price}<br>
        <ul style="font-size: 11px; color: #999;">${this.formatSpecs(it.specs)}</ul>
      </div>
    `).join('');

    await this.mailerService.sendMail({
      to: process.env.ADMIN_EMAIL,
      subject: `⚠️ ALERTA DE VENDA: ${order.orderNumber} (${order.customerName})`,
      html: `
        <div style="font-family: sans-serif; background: #f4f4f4; padding: 20px;">
          <h2 style="color: #ff0000;">⚠️ NOVA VENDA REALIZADA</h2>
          <div style="background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
            <h3>FICHA DO CLIENTE</h3>
            <p><strong>NOME:</strong> ${order.customerName}</p>
            <p><strong>CPF:</strong> ${order.customerCPF}</p>
            <p><strong>WHATSAPP:</strong> ${order.customerPhone}</p>
            <p><strong>ENDEREÇO COMPLETO:</strong> ${order.address}</p>
            <hr>
            <h3>LOGÍSTICA DE PAGAMENTO</h3>
            <p><strong>TOTAL:</strong> R$ ${Number(order.total).toLocaleString('pt-BR')}</p>
            <p><strong>FORMA:</strong> ${order.paymentMethod}</p>
            <p><strong>OPERADOR:</strong> ${order.carrier}</p>
            <hr>
            <h3>ITENS E ESPECIFICAÇÕES TÉCNICAS</h3>
            ${itemsHtml}
          </div>
        </div>
      `,
    });
  }

  // 3. ATUALIZAÇÃO DE STATUS (Acompanhamento Real)
  async sendStatusUpdate(order: any) {
    const messages = {
        AGUARDANDO_PAGAMENTO: "Estamos aguardando o processamento do seu pagamento.",
        AGUARDANDO_FABRICACAO: "Pagamento confirmado! O projeto já entrou na fila da nossa luthieria têxtil.",
        EM_PRODUCAO: "⚡ Grandiosas notícias! Seu instrumento acaba de entrar na linha de produção e está sendo fabricado agora!",
        AGUARDANDO_ENVIO: "Seu arsenal foi finalizado e polido! Agora ele está no setor de triagem para envio.",
        ENVIADO: `Carga a caminho! O código de rastreio foi gerado e está no seu painel.`,
        ENTREGUE: "Missão SOTH concluída! Seu equipamento chegou ao destino final.",
        CANCELADO: "Seu pedido foi anulado pelo sistema ou por solicitação direta. Se o pagamento foi processado, entre em contato com nosso suporte para estorno."
    };

    const currentMsg = messages[order.status] || "Seu pedido está em um novo estágio de processamento.";

    await this.mailerService.sendMail({
      to: order.customerEmail,
      subject: `📡 Atualização de Status SOTH: ${order.orderNumber}`,
      html: `
        <div style="background-color: #000; color: #fff; padding: 40px; font-family: sans-serif; border: 2px solid #ff0000; border-radius: 20px; text-align: center;">
          <h1 style="color: #ff0000;">ATUALIZAÇÃO LOGÍSTICA</h1>
          <p style="font-size: 18px; margin: 20px 0;">${currentMsg}</p>
          <div style="display: inline-block; padding: 10px 20px; border: 1px solid #ff0000; border-radius: 5px;">
            Status: <span style="text-transform: uppercase; font-weight: bold; color: #ff0000;">${order.status.replace('_', ' ')}</span>
          </div>
          <br><br>
          <a href="${process.env.FRONTEND_URL}/dashboard" style="background: #ff0000; color: #fff; padding: 15px 30px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block;">ACOMPANHAR NO DASHBOARD</a>
        </div>
      `,
    });
  }
}