import z from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});
type LoginType = z.infer<typeof loginSchema>;
const signupSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
    confirm_password: z.string().min(6),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords do not match",
  });
const journalSchema = z.object({
  title: z.string().min(1, "Title is required"),
  entry: z.string().min(1, "Entry is required"),
  mood_id: z.string().min(1, "Mood is required"),
  tag_id: z.string().min(1, "Tag is required"),
});

const otpSchema = z.object({
  pin: z.string().regex(/^\d{4}$/, "OTP must be a 4-digit number"),
});

type OtpFormValues = z.infer<typeof otpSchema>;
type JournalType = z.infer<typeof journalSchema>;
type SignupType = z.infer<typeof signupSchema>;

export { journalSchema, loginSchema, signupSchema, otpSchema };
export type { JournalType, LoginType, SignupType, OtpFormValues };
