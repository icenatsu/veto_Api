// types/customError.ts
export interface CustomError extends Error {
  title?: string;
  authRequired?: boolean;
}

