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

type JournalType = z.infer<typeof journalSchema>;
type SignupType = z.infer<typeof signupSchema>;

export { journalSchema, loginSchema, signupSchema };
export type { JournalType, LoginType, SignupType };
