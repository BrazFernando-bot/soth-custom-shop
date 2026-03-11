import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class StorageService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLD_CLOUD_NAME,
      api_key: process.env.CLD_API_KEY,
      api_secret: process.env.CLD_API_SECRET,
    });
  }

  async uploadImage(base64Image: string): Promise<string> {
    // Se já for uma URL (ex: unsplash), não faz upload, só retorna
    if (base64Image.startsWith('http')) return base64Image;

    try {
      const result = await cloudinary.uploader.upload(base64Image, {
        folder: 'soth_arsenal', // Nome da pasta no Cloudinary
        resource_type: 'image',
      });
      return result.secure_url;
    } catch (error) {
      console.error('Erro no upload Cloudinary:', error);
      throw new Error('Falha ao processar imagem');
    }
  }

  // Função auxiliar para processar várias imagens de uma vez
  async uploadMany(images: string[]): Promise<string[]> {
    if (!images || images.length === 0) return [];
    
    const uploadPromises = images.map(img => this.uploadImage(img));
    return Promise.all(uploadPromises);
  }
}