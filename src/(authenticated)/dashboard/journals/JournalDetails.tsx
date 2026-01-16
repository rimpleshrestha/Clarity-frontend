function JournalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { requestUnlock, unlockToken, closeModal } = useJournalUnlock();
  const [isEditing, setIsEditing] = useState(false);

  // 1. Auto-trigger unlock modal if token is missing

  // 2. Fetch Journal Data
  const { data: journal, isLoading } = useQuery({
    queryKey: ["journal", id],
    queryFn: async () => {
      const res = await api.get(`/journal/${id}`, {
        headers: { "x-unlock-token": unlockToken },
      });
      return res.data.data;
    },
    enabled: !!unlockToken, // Only fetch if we have a token
    staleTime: 0,
  });

  // 3. Fetch Metadata for Form
  const [moodQuery, tagQuery] = useQueries({
    queries: [
      { queryKey: ["moods"], queryFn: getMoods, staleTime: Infinity },
      { queryKey: ["tags"], queryFn: getTags, staleTime: Infinity },
    ],
  });

  // 4. Update Mutation
  const updateMutation = useMutation({
    mutationFn: async (values: any) => {
      return api.put(
        `/journal/${id}`,
        {
          title: values.title,
          entry: values.entry,
          mood_id: Number(values.mood_id),
          tag_id: [Number(values.tag_id)], // Wrap in array as per your API
          is_favorate: journal?.is_favorate || false,
        },
        { headers: { "x-unlock-token": unlockToken } }
      );
    },
    onSuccess: () => {
      toast.success("Journal updated successfully");
      setIsEditing(false);
      navigate(-1); // Or refetch() if you want to stay on the page
    },
    onError: () => toast.error("Failed to update journal"),
  });
  if (!unlockToken) {
    return (
      <div className="p-20 text-center">
        <Button
          onClick={() => {
            requestUnlock();
          }}
        >
          Unlock to View/Edit
        </Button>
      </div>
    );
  }
  // Loading State
  if (isLoading || !journal) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin w-10 h-10 text-primary" />
        <p className="text-muted-foreground mt-4">Decrypting your entry...</p>
      </div>
    );
  }

  return (
    <div className=" p-1 lg:p-6 max-w-7xl mx-auto">
      {/* ACTION BAR: Top-right positioning is usually better for UX */}
      <div className="flex justify-end mb-4">
        <Button
          variant={isEditing ? "ghost" : "outline"}
          onClick={() => setIsEditing(!isEditing)}
          className="gap-2"
        >
          {isEditing ? (
            <>
              <X size={18} /> Cancel
            </>
          ) : (
            <>
              <Pencil size={18} /> Edit Entry
            </>
          )}
        </Button>
      </div>

      {isEditing ? (
        <JournalForm
          initialData={{
            title: journal.title,
            entry: journal.entry,
            mood_id: journal.mood.id.toString(),
            tag_id: journal.tag[0]?.id.toString() || "",
          }}
          moods={moodQuery.data?.data ?? []}
          tags={tagQuery.data?.data ?? []}
          onSubmit={(values) => updateMutation.mutate(values)}
          isLoading={updateMutation.isPending}
        />
      ) : (
        <JournalDetailCard data={journal} />
      )}
    </div>
  );
}

export default JournalDetail;

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Pencil, Star, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate, useParams } from "react-router";
import { useJournalUnlock } from "@/contexts/LockContext";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import { getMoods, getTags } from "@/(authenticated)/api";
import { Button } from "@/components/ui/button";
import { JournalForm } from "./JournalForm";
import { toast } from "sonner";
import api from "@/utils/axios-interceptor";

interface JournalDetailProps {
  data: {
    id: number;
    title: string;
    entry: string;
    is_favorate: boolean;
    created_at: string;
    updated_at: string;
    mood: {
      id: number;
      name: string;
      icon: string;
    };
    tag: {
      id: number;
      name: string;
    }[];
  };
}

export function JournalDetailCard({ data }: JournalDetailProps) {
  return (
    <div className="  p-6">
      <Card className="bg-primary">
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl font-semibold">
                {data.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Created on {new Date(data.created_at).toLocaleDateString()}
              </p>
            </div>

            {data.is_favorate && (
              <Star
                className={cn(
                  "w-6 h-6",
                  data.is_favorate
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-muted-foreground"
                )}
              />
            )}
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <span>{data.mood.icon}</span>
              <span>{data.mood.name}</span>
            </Badge>

            {data.tag.map((t) => (
              <Badge key={t.id} variant="outline">
                #{t.name}
              </Badge>
            ))}
          </div>
        </CardHeader>

        <CardContent className="mt-4 space-y-6">
          <article
            dangerouslySetInnerHTML={{ __html: data.entry }}
            className="text-base text-black dark:text-white prose prose-base leading-relaxed whitespace-pre-wrap"
          ></article>

          <div className="text-xs text-muted-foreground flex justify-between">
            <span>Journal ID: {data.id}</span>
            <span>
              Last updated {new Date(data.updated_at).toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
