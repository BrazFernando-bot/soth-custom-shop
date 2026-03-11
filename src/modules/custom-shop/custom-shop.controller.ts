import { Controller, Get, Post, Body, Param, Delete, Query, Patch } from '@nestjs/common';
import { CustomShopService } from './custom-shop.service';
import { CreateLineDto } from './dto/create-line.dto';
import { CreateCustomModelDto } from './dto/create-custom-model.dto';

@Controller('custom-shop')
export class CustomShopController {
  constructor(private readonly customShopService: CustomShopService) {}

  @Post('lines')
  createLine(@Body() createLineDto: CreateLineDto) {
    return this.customShopService.createLine(createLineDto);
  }

  @Get('lines')
  findAllLines(@Query('type') type: string) {
    return this.customShopService.findAllLines(type);
  }

  // ROTA PATCH PARA LINHAS
  @Patch('lines/:id')
  updateLine(@Param('id') id: string, @Body() data: any) {
    return this.customShopService.updateLine(id, data);
  }

  @Delete('lines/:id')
  removeLine(@Param('id') id: string) {
    return this.customShopService.removeLine(id);
  }

  @Post('models')
  createModel(@Body() createCustomModelDto: CreateCustomModelDto) {
    return this.customShopService.createModel(createCustomModelDto);
  }

  // ROTA PATCH PARA MODELOS
  @Patch('models/:id')
  updateModel(@Param('id') id: string, @Body() data: any) {
    return this.customShopService.updateModel(id, data);
  }

  @Get('lines/:lineId/models')
  findModels(@Param('lineId') lineId: string) {
    return this.customShopService.findModelsByLine(lineId);
  }

  @Delete('models/:id')
  removeModel(@Param('id') id: string) {
    return this.customShopService.removeModel(id);
  }
}