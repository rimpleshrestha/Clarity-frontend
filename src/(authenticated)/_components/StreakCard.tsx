import { Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StreakCardProps {
  days: number;
}

export const StreakCard = ({ days }: StreakCardProps) => {
  return (
    <Card className=" my-2 border-none rounded-none bg-[#422DB5]/12 w-full ">
      <CardContent className="flex items-center gap-4 ">
        <div className="bg-[#FF704D] p-4 rounded-full">
          <Flame className="text-white fill-white size-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-slate-400  font-medium">Current Streak</span>
          <span className="text-xl font-bold text-card-foreground">
            {days} Days
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
