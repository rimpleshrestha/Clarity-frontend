import { useSearchParams } from "react-router";
import { useQuery, useQueries, keepPreviousData } from "@tanstack/react-query";
import { Loader2, FilterX } from "lucide-react";

import JournalCard from "@/(authenticated)/_components/JournalCard";
import { getJournals, getMoods, getTags } from "@/(authenticated)/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useDebounce from "@/hooks/useDebounce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Journal = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract filters from URL
  const title = searchParams.get("title") ?? "";
  const moodId = searchParams.get("mood_id") ?? "all";
  const tagId = searchParams.get("tag_id") ?? "all";

  const debouncedTitle = useDebounce({ data: title, delay: 400 });

  // 1. Fetch Metadata for Dropdowns
  const [moodsRes, tagsRes] = useQueries({
    queries: [
      { queryKey: ["moods"], queryFn: getMoods, staleTime: Infinity },
      { queryKey: ["tags"], queryFn: getTags, staleTime: Infinity },
    ],
  });

  // 2. Fetch Main Journals with Filters
  const { data, isPending } = useQuery({
    queryKey: ["journals", debouncedTitle, moodId, tagId],
    placeholderData: keepPreviousData,
    queryFn: () =>
      getJournals({
        title: debouncedTitle,
        mood_id: moodId !== "all" ? moodId : undefined,
        tag_id: tagId !== "all" ? tagId : undefined,
      }),
    staleTime: 0, // Data is immediately stale
    gcTime: 0, // (Optional) Remove data from cache as soon as component unmounts
    refetchOnMount: "always", // Force a refetch every single time the component mounts
  });

  const updateFilters = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === "all" || value === "") {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const resetFilters = () => setSearchParams({});

  const hasFilters = title || moodId !== "all" || tagId !== "all";

  return (
    <div className="flex flex-col gap-5 p-4 lg:p-10">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-semibold text-[#699BEC]">Your Entries</h1>
        {hasFilters && (
          <Button
            variant="ghost"
            onClick={resetFilters}
            className="text-muted-foreground"
          >
            <FilterX className="mr-2 h-4 w-4" /> Reset Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:flex items-center gap-4">
        {/* Search Input */}
        <div className="flex-1 flex items-center rounded-full bg-primary px-4">
          <Input
            placeholder="Search your entries...."
            value={title}
            onChange={(e) => updateFilters("title", e.target.value)}
            className="py-5 bg-transparent border-0 shadow-none ring-0 focus-visible:ring-0"
          />
        </div>

        {/* Mood Filter */}
        <Select
          value={moodId}
          onValueChange={(val) => updateFilters("mood_id", val)}
        >
          <SelectTrigger className="w-full md:w-[160px] rounded-full bg-primary border-0 focus:ring-0">
            <SelectValue placeholder="Mood" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Moods</SelectItem>
            {moodsRes.data?.data.map((m: any) => (
              <SelectItem key={m.id} value={m.id.toString()}>
                {m.icon} {m.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Tag/Feeling Filter */}
        <Select
          value={tagId}
          onValueChange={(val) => updateFilters("tag_id", val)}
        >
          <SelectTrigger className="w-full md:w-[160px] rounded-full bg-primary border-0 focus:ring-0">
            <SelectValue placeholder="Feeling" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All tags</SelectItem>
            {tagsRes.data?.data.map((t: any) => (
              <SelectItem key={t.id} value={t.id.toString()}>
                {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <hr className="opacity-10" />

      {isPending && <Loader2 className="mx-auto animate-spin mt-10" />}

      <div className="space-y-4 flex flex-col gap-4">
        {data?.data.length > 0
          ? data.data.map((item: any) => (
              <JournalCard
                key={item.id}
                id={item.id}
                is_favorate={item.is_favorate}
                title={item.title}
                description={item.entry}
                tag={item.mood.name}
              />
            ))
          : !isPending && (
              <div className="text-center py-20 border-2 border-dashed rounded-xl">
                <p className="text-muted-foreground">
                  No matching journal entries found.
                </p>
              </div>
            )}
      </div>
    </div>
  );
};

export default Journal;
