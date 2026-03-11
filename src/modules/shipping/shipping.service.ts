import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ShippingService {
  async calculate(data: any) {
    const { zipCode, items } = data;

    const url = process.env.MELHOR_ENVIO_URL || 'https://www.melhorenvio.com.br/api/v2/me/shipment/calculate';
    const token = process.env.MELHOR_ENVIO_TOKEN || '';
    const originZip = process.env.ORIGIN_ZIP || '01001000';

    try {
      const payload = {
        from: { postal_code: originZip },
        to: { postal_code: zipCode },
        products: items.map((item: any) => ({
          id: String(item.id),
          width: Number(item.width) || 20,
          height: Number(item.height) || 10,
          length: Number(item.length) || 20,
          weight: Number(item.weight) || 1,
          insurance_value: Number(item.price),
          quantity: Number(item.quantity) || 1
        }))
      };

      const response = await axios.post(url, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'SothShop'
        }
      });

      return response.data
        .filter((s: any) => !s.error && s.price)
        .map((ship: any) => ({
          id: ship.id,
          name: ship.name,
          company: ship.company.name,
          price: Number(ship.price),
          deadline: ship.delivery_time,
          image: ship.company.picture
        }));

    } catch (error: any) {
      console.error('❌ ERRO MELHOR ENVIO:', error.response?.data || error.message);
      
      // FALLBACK SE A API FALHAR
      return [
        { id: 'std', name: 'Entrega Padrão (SOTH)', company: 'SOTH', price: 45.00, deadline: 8, image: 'https://cdn-icons-png.flaticon.com/512/709/709790.png' },
        { id: 'exp', name: 'Entrega Expressa', company: 'SOTH', price: 95.00, deadline: 3, image: 'https://cdn-icons-png.flaticon.com/512/709/709790.png' }
      ];
    }
  }
}