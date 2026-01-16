// components/OtpDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { otpSchema, type OtpFormValues } from "@/utils/zod-schema";
import { useMutation } from "@tanstack/react-query";
import { upsertPib } from "../api";
import { toast } from "sonner";

interface OtpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitOtp: (otp: string) => void;
}

export const OtpDialog = ({
  open,
  onOpenChange,
  onSubmitOtp,
}: OtpDialogProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
  });

  const {isPending, mutate } = useMutation({
    mutationFn: upsertPib,
  });
  const onSubmit = (data: OtpFormValues) => {
    mutate(data, {
      onSuccess: () => {
        toast.success("Pin has been changed");
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enter Pin</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            {...register("pin")}
            inputMode="numeric"
            maxLength={4}
            placeholder="Enter 4-digit code"
            className="text-center text-xl tracking-widest"
          />

          {errors.pin && (
            <p className="text-sm text-red-500">{errors.pin.message}</p>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            Verify {isPending && "..."}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
