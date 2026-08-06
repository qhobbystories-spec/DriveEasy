import { User } from '@prisma/client';
import { BaseRepository } from './base.repository';
import prisma from '../prisma/client';

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super('user');
  }

  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async findByRole(role: string, skip: number = 0, take: number = 10): Promise<User[]> {
    return await prisma.user.findMany({
      where: {
        role: role as any,
        deletedAt: null,
      },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findActive(skip: number = 0, take: number = 10): Promise<User[]> {
    return await prisma.user.findMany({
      where: {
        isActive: true,
        deletedAt: null,
      },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async countByRole(role: string): Promise<number> {
    return await prisma.user.count({
      where: {
        role: role as any,
        deletedAt: null,
      },
    });
  }

  async findVerifiedUsers(): Promise<User[]> {
    return await prisma.user.findMany({
      where: {
        isVerified: true,
        deletedAt: null,
      },
    });
  }

  async updateStatus(id: string, status: string): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data: { status: status as any },
    });
  }

  async verifyEmail(id: string): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data: { isVerified: true },
    });
  }
}

export const userRepository = new UserRepository();
