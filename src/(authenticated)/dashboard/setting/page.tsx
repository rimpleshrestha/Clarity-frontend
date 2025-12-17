import SettingCard from "@/(authenticated)/_components/SettingCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const SettingPage = () => {
  return (
    <main className="p-20 ">
      <h1 className="text-3xl font-semibold text-[#699BEC]">Settings</h1>
      <span className="text-muted-foreground">
        Customize your journaling experience
      </span>
      <div className="flex flex-col gap-10 mt-20 ">
        <SettingCard
          title="Appearance"
          description="Choose your preferred theme"
        >
          <div className="flex w-full justify-between gap-2 items-center">
            <Label>Dark Mode</Label>
            <Switch />
          </div>
        </SettingCard>
        <SettingCard
          title="Daily Reminder"
          description="Get reminded to journal every day"
        >
          <div className="flex w-full justify-between gap-2 items-center">
            {" "}
            <Label>Enable Daily Reminder</Label>
            <Switch />
          </div>
        </SettingCard>
        <SettingCard
          title="Privacy & Security"
          description="Protect your journal with a PIN"
        >
          <div className="flex w-full justify-between gap-2 items-center">
            <Label>Enable Pin</Label>
            <Button>Set Pin</Button>
          </div>
        </SettingCard>
      </div>
    </main>
  );
};

export default SettingPage;
