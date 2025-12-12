interface APIResponse<T> {
  message: string;
  data?: T;
}

interface SignupResponse {
  access_token: string;
}
export type { APIResponse, SignupResponse };
