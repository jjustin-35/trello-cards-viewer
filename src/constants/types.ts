type Error = {
  error_code: number;
};

export type ApiResponse<T = any> =
  | {
      data?: T;
    }
  | Error;

export const isRespError = (resp: ApiResponse): resp is Error => {
  return "error_code" in resp;
};
