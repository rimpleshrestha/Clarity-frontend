import z from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});
type LoginType = z.infer<typeof loginSchema>;
const signupSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirm_password: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
  })
  .refine((ctx) => {
    ctx.password == ctx.confirm_password,
      {
        message: "Password and confirm password should match",
        path: ["confirm_password"],
      };
  });
type SignupType = z.infer<typeof signupSchema>;

export { loginSchema, signupSchema };
export type { LoginType, SignupType };
