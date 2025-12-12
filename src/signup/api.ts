import type { APIResponse, SignupResponse } from "@/lib/types";
import api from "@/utils/axios-interceptor";
import type { LoginType, SignupType } from "@/utils/zod-schema";

export const signupUser = async (
  data: SignupType
): Promise<APIResponse<SignupResponse>> => {
  const res = await api.post(
    "/sign-up",
    {
      email: data.email,
      password: data.password,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return await res.data;
};
export const loginUser = async (
  data: LoginType
): Promise<APIResponse<SignupResponse>> => {
  const res = await api.post(
    "/login",
    {
      email: data.email,
      password: data.password,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return await res.data;
};
