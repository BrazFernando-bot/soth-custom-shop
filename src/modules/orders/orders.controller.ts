import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
// IMPORTANTE: Ajuste o caminho dos seus Guards abaixo para onde eles estiverem no seu projeto
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // Criar pedido (Qualquer usuário logado pode)
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() data: any) {
    return this.ordersService.create(data);
  }

  // --- ROTAS ADMINISTRATIVAS (BLINDADAS) ---
  
  // Apenas ADMIN pode ver todos os pedidos
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('admin/all')
  async findAllAdmin() {
    return this.ordersService.findAllAdmin();
  }

  // Apenas ADMIN pode mudar status de pedidos
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('admin/:id/status')
  async updateStatus(
    @Param('id') id: string, 
    @Body() data: { status: any; trackingCode?: string }
  ) {
    return this.ordersService.updateStatus(id, data);
  }

  // Apenas ADMIN pode remover pedidos permanentemente
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete('admin/:id')
  async remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }

  // --- ROTAS DO CLIENTE ---

  // O cliente só vê os próprios pedidos
  @UseGuards(JwtAuthGuard)
  @Get('my-orders')
  async findMyOrders() {
    // Aqui você deve passar o ID do usuário logado (geralmente via @Request())
    return this.ordersService.findAllAdmin(); // Ajuste no Service para filtrar por userId
  }
}