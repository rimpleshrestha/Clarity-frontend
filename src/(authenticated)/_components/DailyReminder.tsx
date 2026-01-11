"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const times = [
  { label: "6:00 AM", value: "06:00" },
  { label: "7:00 AM", value: "07:00" },
  { label: "8:00 AM", value: "08:00" },
  { label: "9:00 AM", value: "09:00" },
  { label: "10:00 AM", value: "10:00" },
  { label: "11:00 AM", value: "11:00" },
  { label: "12:00 PM", value: "12:00" },
  { label: "1:00 PM", value: "13:00" },
  { label: "2:00 PM", value: "14:00" },
  { label: "3:00 PM", value: "15:00" },
  { label: "4:00 PM", value: "16:00" },
  { label: "5:00 PM", value: "17:00" },
  { label: "6:00 PM", value: "18:00" },
  { label: "7:00 PM", value: "19:00" },
  { label: "8:00 PM", value: "20:00" },
  { label: "9:00 PM", value: "21:00" },
  { label: "10:00 PM", value: "22:00" },
];

const DailyReminderCard = () => {
  // 1. Initialize state from sessionStorage
  const [time, setTime] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("reminderTime") || "22:00";
    }
    return "22:00";
  });

  const [enabled, setEnabled] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("reminderEnabled") === "true";
    }
    return false;
  });

  const showNotification = () => {
    new Notification("Daily Reminder", {
      body: "Don't forget to write your journal today!",
      icon: "/icons/notification-icon.png", // Ensure this path is correct in your public folder
    });
  };

  const scheduleDailyNotification = useCallback(() => {
    // Clear existing intervals/timeouts
    if ((window as any).dailyNotificationTimeout) {
      clearTimeout((window as any).dailyNotificationTimeout);
    }
    if ((window as any).dailyNotificationInterval) {
      clearInterval((window as any).dailyNotificationInterval);
    }

    const [hours, minutes] = time.split(":").map(Number);
    const now = new Date();
    let firstNotification = new Date();
    firstNotification.setHours(hours, minutes, 0, 0);

    // If the time has already passed today, set it for tomorrow
    if (firstNotification.getTime() < now.getTime()) {
      firstNotification.setDate(firstNotification.getDate() + 1);
    }

    const delayUntilFirst = firstNotification.getTime() - now.getTime();

    // Schedule the first one, then start the 24h interval
    (window as any).dailyNotificationTimeout = setTimeout(() => {
      showNotification();
      (window as any).dailyNotificationInterval = setInterval(() => {
        showNotification();
      }, 24 * 60 * 60 * 1000);
    }, delayUntilFirst);
  }, [time]);

  // 2. Persist changes and manage notification permissions
  useEffect(() => {
    sessionStorage.setItem("reminderTime", time);
    sessionStorage.setItem("reminderEnabled", enabled.toString());

    if (enabled) {
      if (Notification.permission === "granted") {
        scheduleDailyNotification();
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") scheduleDailyNotification();
          else setEnabled(false);
        });
      } else {
        setEnabled(false);
      }
    } else {
      // Clear timers if disabled
      clearTimeout((window as any).dailyNotificationTimeout);
      clearInterval((window as any).dailyNotificationInterval);
    }
  }, [enabled, time, scheduleDailyNotification]);

  const toggleReminder = () => {
    setEnabled((prev) => !prev);
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center gap-6 text-center p-6  rounded-xl ">
      <h2 className="text-xl font-semibold text-gray-800">You will get a</h2>
      <div className="text-3xl font-bold flex items-center gap-2">
        Daily Reminder! <span>🔔</span>
      </div>
      <p className="text-gray-400">Set time for daily reminder</p>

      <Select value={time} onValueChange={setTime}>
        <SelectTrigger className="rounded-full w-48">
          <SelectValue placeholder="Select time" />
        </SelectTrigger>
        <SelectContent>
          {times.map((t) => (
            <SelectItem key={t.value} value={t.value}>
              {t.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        onClick={toggleReminder}
        variant={enabled ? "destructive" : "default"}
        className="w-full mt-4 rounded-full"
      >
        {enabled ? "Disable Reminder" : "Enable Reminder"}
      </Button>
    </div>
  );
};

export default DailyReminderCard;
