import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {
  randomFromArray<T>(array: T[]): T {
    let count: number = array.length;
    let index: number = Math.floor(Math.random() * count);
    return array[index];
  }

  shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}

export const Utils = new UtilsService();
