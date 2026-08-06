export interface PaginationParams {
  page?: number;
  limit?: number;
  skip?: number;
}

export const getPaginationParams = (
  page: number = 1,
  limit: number = 10
): PaginationParams => {
  const validPage = Math.max(1, page);
  const validLimit = Math.min(100, Math.max(1, limit));
  const skip = (validPage - 1) * validLimit;

  return {
    page: validPage,
    limit: validLimit,
    skip,
  };
};

export const calculateTotalPages = (total: number, limit: number): number => {
  return Math.ceil(total / limit);
};

export const hasNextPage = (
  page: number,
  limit: number,
  total: number
): boolean => {
  return page * limit < total;
};

export const hasPreviousPage = (page: number): boolean => {
  return page > 1;
};

export const getNextPage = (page: number, hasNext: boolean): number | null => {
  return hasNext ? page + 1 : null;
};

export const getPreviousPage = (page: number, hasPrev: boolean): number | null => {
  return hasPrev ? page - 1 : null;
};
