import JournalCard from "@/(authenticated)/_components/JournalCard";
import { getJournals, getSavedJournals } from "@/(authenticated)/api";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "react-router";

const Journal = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const deboucedValue = useDebounce({
    data: searchParams.get("title") ?? "",
    delay: 400,
  });
  let { data, isPending, refetch } = useQuery({
    queryKey: ["saved-journals", deboucedValue],
    queryFn: () => getSavedJournals({ title: deboucedValue }),
  });

  return (
    <div className="flex flex-col gap-5 p-10">
      <h1 className="text-4xl font-semibold text-[#699BEC]">
        Favorite Entries
      </h1>
      <div className="flex justify-center items-center w rounded-full bg-primary">
        <Input
          placeholder="Search your entries...."
          value={searchParams.get("title") ?? ""}
          onChange={(e) => {
            searchParams.set("title", e.target.value);
            setSearchParams(searchParams);
          }}
          className="py-5 bg-transparent shadow-none outline-none ring-0 focus-visible:border-none focus-visible:ring-0 focus:ring-0"
        />
      </div>

      {isPending && <Loader2 className="mx-auto animate-spin" />}
      {data?.data.length > 0 ? (
        data.data.map((item: any) => (
          <JournalCard
            id={item.id}
            title={item.title}
            description={item.entry}
            tag={item.mood.name}
            is_favorate={item.is_favorate}
          />
        ))
      ) : (
        <>No Journal Entry Yet</>
      )}
    </div>
  );
};

export default Journal;
