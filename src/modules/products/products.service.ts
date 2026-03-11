import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { StorageService } from '../../shared/storage/storage.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService, private storageService: StorageService) {}

  async create(data: CreateProductDto) {
    const imageUrls = await this.storageService.uploadMany(data.images);
    return this.prisma.product.create({
      data: {
        name: data.name,
        subtitle: data.subtitle,
        description: data.description,
        price: data.price,
        category: data.category,
        images: imageUrls, // O banco usa 'images'
        weight: Number(data.weight) || 1,
        height: Number(data.height) || 10,
        width: Number(data.width) || 10,
        length: Number(data.length) || 10,
      },
    });
  }

  async findAll() {
    return this.prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async update(id: string, data: any) {
    let imageUrls = data.images;
    if (data.images && data.images.length > 0 && !data.images[0].startsWith('http')) {
      imageUrls = await this.storageService.uploadMany(data.images);
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        subtitle: data.subtitle,
        description: data.description,
        price: data.price,
        category: data.category,
        images: imageUrls,
        weight: Number(data.weight),
        height: Number(data.height),
        width: Number(data.width),
        length: Number(data.length),
      },
    });
  }

  async remove(id: string) {
    return this.prisma.product.delete({ where: { id } });
  }
}