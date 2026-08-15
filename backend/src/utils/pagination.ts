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
