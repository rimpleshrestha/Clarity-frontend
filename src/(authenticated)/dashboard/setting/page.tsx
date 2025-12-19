"use client";

import DailyReminderCard from "@/(authenticated)/_components/DailyReminder";
import { OtpDialog } from "@/(authenticated)/_components/OTPDialog";
import SettingCard from "@/(authenticated)/_components/SettingCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ModeToggle } from "@/(authenticated)/_components/ModeToggle";

const SettingPage = () => {
  const [otpOpen, setOtpOpen] = useState(false);
  const [reminderOpen, setReminderOpen] = useState(false);

  return (
    <main className="p-20 ">
      {/* OTP Dialog */}
      <OtpDialog
        open={otpOpen}
        onOpenChange={setOtpOpen}
        onSubmitOtp={(otp) => {
          console.log("OTP entered:", otp);
          setOtpOpen(false);
        }}
      />

      <h1 className="text-3xl font-semibold text-[#699BEC]">Settings</h1>
      <span className="text-muted-foreground">
        Customize your journaling experience
      </span>

      <div className="flex flex-col gap-10 mt-20 ">
        {/* Appearance Setting */}
        <SettingCard
          title="Appearance"
          description="Choose your preferred theme"
        >
          <div className="flex w-full justify-between gap-2 items-center">
            <Label>Dark Mode</Label>
            <ModeToggle />
          </div>
        </SettingCard>

        {/* Daily Reminder Setting */}
        <SettingCard
          title="Daily Reminder"
          description="Set your preferred daily reminder"
        >
          <div className="flex w-full justify-between gap-2 items-center">
            <Label>Enable Daily Reminder</Label>

            {/* Dialog Trigger */}
            <Dialog open={reminderOpen} onOpenChange={setReminderOpen}>
              <DialogTrigger asChild>
                <Switch />
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DailyReminderCard />
              </DialogContent>
            </Dialog>
          </div>
        </SettingCard>

        {/* Privacy & Security Setting */}
        <SettingCard
          title="Privacy & Security"
          description="Protect your journal"
        >
          <div className="flex w-full justify-between gap-2 items-center">
            <Label>Enable Pin</Label>
            <Button onClick={() => setOtpOpen(true)}>Set Pin</Button>
          </div>
        </SettingCard>
      </div>
    </main>
  );
};

export default SettingPage;
