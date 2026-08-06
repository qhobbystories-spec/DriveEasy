import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message: string = 'Success',
  statusCode: number = 200,
  pagination?: ApiResponse['pagination']
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    statusCode,
    message,
    data,
  };

  if (pagination) {
    response.pagination = pagination;
  }

  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message: string = 'Error',
  statusCode: number = 500,
  data?: any
): Response => {
  const response: ApiResponse = {
    success: false,
    statusCode,
    message,
  };

  if (data) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

export const sendPaginated = <T>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  limit: number,
  message: string = 'Success',
  statusCode: number = 200
): Response => {
  const pages = Math.ceil(total / limit);

  const response: ApiResponse<T[]> = {
    success: true,
    statusCode,
    message,
    data,
    pagination: {
      page,
      limit,
      total,
      pages,
    },
  };

  return res.status(statusCode).json(response);
};
