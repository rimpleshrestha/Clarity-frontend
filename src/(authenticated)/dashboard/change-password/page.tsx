"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../profile/user-api";

/* ---------- Zod Schema ---------- */
const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

const ChangePasswordForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      changePassword(data),
    onSuccess: () => {
      toast.success("Password updated successfully");
      reset();
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "Failed to change password";
      toast.error(msg);
    },
  });

  const onSubmit = (data: ChangePasswordForm) => {
    mutation.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className=" space-y-4  rounded-lg ">
      <div>
        <label className="text-sm text-muted-foreground">
          Current Password
        </label>
        <Input type="password" {...register("currentPassword")} />
        {errors.currentPassword && (
          <p className="text-red-500 text-sm mt-1">
            {errors.currentPassword.message}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm text-muted-foreground">New Password</label>
        <Input type="password" {...register("newPassword")} />
        {errors.newPassword && (
          <p className="text-red-500 text-sm mt-1">
            {errors.newPassword.message}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm text-muted-foreground">
          Confirm New Password
        </label>
        <Input type="password" {...register("confirmPassword")} />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Updating..." : "Change Password"}
      </Button>
    </form>
  );
};

export default ChangePasswordForm;
