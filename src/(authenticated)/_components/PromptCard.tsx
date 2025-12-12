import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";

const PromptCard = () => {
  return (
    <Card className="max-w-4xl w-full h-[300px] bg-[#D3C6EA] rounded-2xl text-2xl font-semibold">
      <CardHeader className="flex flex-col  justify-center h-full w-full items-center">
        <span className=" text-center text-sm text-[#8C5EBF]">Emotional</span>
        <CardTitle>Who have you not forgiven and why</CardTitle>
      </CardHeader>
    </Card>
  );
};

export default PromptCard;
