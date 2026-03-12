import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';
import { CreateLineDto } from './dto/create-line.dto';
import { CreateCustomModelDto } from './dto/create-custom-model.dto';
import { StorageService } from '../../shared/storage/storage.service';

@Injectable()
export class CustomShopService {
  constructor(private prisma: PrismaService, private storageService: StorageService) {}

  async createLine(data: CreateLineDto) {
    const rawImage = data['image'] || data['img'];
    let imageUrl = rawImage;
    if (rawImage && !rawImage.startsWith('http')) {
       imageUrl = await this.storageService.uploadImage(rawImage);
    }
    return this.prisma.line.create({
      data: {
        name: data.name,
        description: data.description || '',
        type: data.type as string || 'BAGS',
        img: imageUrl || ''
      }
    });
  }

  async updateLine(id: string, data: any) {
    const rawImage = data['image'] || data['img'];
    let imageUrl = rawImage;
    if (rawImage && !rawImage.startsWith('http')) {
      imageUrl = await this.storageService.uploadImage(rawImage);
    }
    return this.prisma.line.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        img: imageUrl
      },
    });
  }

  async findAllLines(type?: string) {
    return this.prisma.line.findMany({ where: type ? { type } : {}, include: { models: true } });
  }

  async removeLine(id: string) {
    return this.prisma.line.delete({ where: { id } });
  }

  async createModel(data: CreateCustomModelDto) {
    const imageUrls = await this.storageService.uploadMany(data.images || []);
    return this.prisma.customModel.create({
      data: {
        name: data.name,
        price: Number(data.price) || 0,
        description: data.description || '',
        images: imageUrls,
        externalColors: data.externalColors,
        internalColors: data.internalColors,
        dynamicOptions: data.dynamicOptions,
        requiresMeasurements: data.requiresMeasurements,
        weight: Number(data.weight),
        height: Number(data.height),
        width: Number(data.width),
        length: Number(data.length),
        line: { connect: { id: data.lineId as string } }
      }
    });
  }

  async updateModel(id: string, data: any) {
    let imageUrls = data.images;
    if (data.images && data.images.length > 0 && !data.images[0].startsWith('http')) {
      imageUrls = await this.storageService.uploadMany(data.images);
    }
    return this.prisma.customModel.update({
      where: { id },
      data: {
        name: data.name,
        price: Number(data.price) || 0,
        description: data.description || '',
        images: imageUrls,
        externalColors: data.externalColors,
        internalColors: data.internalColors,
        dynamicOptions: data.dynamicOptions,
        requiresMeasurements: data.requiresMeasurements,
        weight: Number(data.weight),
        height: Number(data.height),
        width: Number(data.width),
        length: Number(data.length)
      },
    });
  }

  async findModelsByLine(lineId: string) {
    return this.prisma.customModel.findMany({ where: { lineId } });
  }

  async removeModel(id: string) {
    return this.prisma.customModel.delete({ where: { id } });
  }
}
