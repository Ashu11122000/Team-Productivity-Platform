/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  getHealth() {
    return {
      status: 'ok',
      service: 'nestjs-backend',
      timestamp: new Date().toISOString(),
    };
  }
}