import JournalCard from "@/(authenticated)/_components/JournalCard";
import { getJournals } from "@/(authenticated)/api";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

const Journal = () => {
  const { data, isPending, refetch } = useQuery({
    queryKey: ["journals"],
    queryFn: getJournals,
  });
  return (
    <div className="flex flex-col gap-5 p-10">
      <h1 className="text-4xl font-semibold text-[#0055E08F]">Your Entries</h1>
      <div className="flex justify-center items-center w rounded-full bg-primary">
        <Input
          placeholder="Search your entries...."
          className="py-5 bg-transparent shadow-none outline-none ring-0 focus-visible:border-none focus-visible:ring-0 focus:ring-0"
        />
      </div>
      {isPending && <Loader2 className="mx-auto animate-spin" />}
      {data?.data?.length > 0 ? (
        data.data.map((item: any) => (
          <JournalCard
            refetch={refetch}
            id={item.id}
            title={item.title}
            description={item.entry}
            tag={item.mood.name}
          />
        ))
      ) : (
        <>No Journal Entry Yet</>
      )}
    </div>
  );
};

export default Journal;
