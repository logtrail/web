/**
 * Http response
 */
export interface HttpResponse {
  httpStatus: number;
  error: string | null;
  data: Record<any, any>;
}
