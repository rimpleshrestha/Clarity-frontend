import JournalCard from "@/(authenticated)/_components/JournalCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";

const SavedJournal = () => {
  return (
    <div className="flex flex-col gap-5 p-10">
      <h1 className="text-4xl font-semibold text-[#0055E08F]">
        Favorate Entries
      </h1>
      <div className="flex justify-center items-center w rounded-full bg-primary">
        <Input
          placeholder="Search your entries...."
          className="py-5 bg-transparent shadow-none outline-none ring-0 focus-visible:border-none focus-visible:ring-0 focus:ring-0"
        />
      </div>
      {Array.from({ length: 4 }).map(() => (
        <JournalCard />
      ))}
    </div>
  );
};

export default SavedJournal;
