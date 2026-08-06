import prisma from '../prisma/client';
import { NotFoundError } from '../utils/errors';

export abstract class BaseRepository<T> {
  protected modelName: string;

  constructor(modelName: string) {
    this.modelName = modelName;
  }

  protected get model(): any {
    return (prisma as any)[this.modelName];
  }

  async findById(id: string): Promise<T | null> {
    const result = await this.model.findUnique({
      where: { id },
    });
    return result || null;
  }

  async findAll(skip: number = 0, take: number = 10): Promise<T[]> {
    return await this.model.findMany({
      where: { deletedAt: null },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(where: any): Promise<T | null> {
    return await this.model.findFirst({ where });
  }

  async create(data: any): Promise<T> {
    return await this.model.create({ data });
  }

  async update(id: string, data: any): Promise<T> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundError(this.modelName);
    }

    return await this.model.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.model.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async count(where?: any): Promise<number> {
    return await this.model.count({ where });
  }

  async findMany(where: any, skip: number = 0, take: number = 10): Promise<T[]> {
    return await this.model.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async countMany(where: any): Promise<number> {
    return await this.model.count({ where });
  }

  async exist(where: any): Promise<boolean> {
    const result = await this.model.findFirst({ where });
    return !!result;
  }
}
