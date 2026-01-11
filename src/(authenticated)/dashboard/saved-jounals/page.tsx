import JournalCard from "@/(authenticated)/_components/JournalCard";
import { getMoods, getSavedJournals, getTags } from "@/(authenticated)/api";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import { keepPreviousData, useQuery, useQueries } from "@tanstack/react-query";
import { Loader2, FilterX } from "lucide-react";
import { useSearchParams } from "react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const Journal = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get filter values from URL
  const title = searchParams.get("title") ?? "";
  const moodId = searchParams.get("mood_id") ?? "all";
  const tagId = searchParams.get("tag_id") ?? "all";

  const deboucedTitle = useDebounce({ data: title, delay: 400 });

  // 1. Fetch metadata for dropdowns
  const [moodsRes, tagsRes] = useQueries({
    queries: [
      { queryKey: ["moods"], queryFn: getMoods },
      { queryKey: ["tags"], queryFn: getTags },
    ],
  });

  // 2. Main Query with filters
  const { data, isPending } = useQuery({
    queryKey: ["saved-journals", deboucedTitle, moodId, tagId],
    placeholderData: keepPreviousData,
    queryFn: () =>
      getSavedJournals({
        title: deboucedTitle,
        mood_id: moodId !== "all" ? moodId : undefined,
        tag_id: tagId !== "all" ? tagId : undefined,
      }),
  });

  const updateFilters = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === "all") {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="flex flex-col gap-5 px-3 lg:p-10">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-semibold text-[#699BEC]">
          Favorite Entries
        </h1>
        {(moodId !== "all" || tagId !== "all" || title) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground"
          >
            <FilterX className="mr-2 h-4 w-4" /> Clear
          </Button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 flex justify-center items-center rounded-full bg-primary px-4">
          <Input
            placeholder="Search your entries...."
            value={title}
            onChange={(e) => updateFilters("title", e.target.value)}
            className="py-5 bg-transparent shadow-none border-0 focus-visible:ring-0"
          />
        </div>

        {/* Mood Filter */}
        <Select
          value={moodId}
          onValueChange={(val) => updateFilters("mood_id", val)}
        >
          <SelectTrigger className="w-full md:w-[180px] rounded-full bg-primary border-0 focus:ring-0">
            <SelectValue placeholder="Mood" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Moods</SelectItem>
            {moodsRes.data?.data.map((mood: any) => (
              <SelectItem key={mood.id} value={mood.id.toString()}>
                {mood.icon} {mood.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Tag Filter */}
        <Select
          value={tagId}
          onValueChange={(val) => updateFilters("tag_id", val)}
        >
          <SelectTrigger className="w-full md:w-[180px] rounded-full bg-primary border-0 focus:ring-0">
            <SelectValue placeholder="Feeling" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All tags</SelectItem>
            {tagsRes.data?.data.map((tag: any) => (
              <SelectItem key={tag.id} value={tag.id.toString()}>
                {tag.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isPending && <Loader2 className="mx-auto animate-spin" />}

      <div className="grid grid-cols-1 gap-4">
        {data?.data.length > 0 ? (
          data.data.map((item: any) => (
            <JournalCard
              key={item.id}
              id={item.id}
              title={item.title}
              description={item.entry}
              tag={item.mood.name}
              is_favorate={item.is_favorate}
            />
          ))
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            No entries found matching your filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default Journal;
