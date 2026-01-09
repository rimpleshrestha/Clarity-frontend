import { useJournalUnlock } from "@/contexts/LockContext";
import api from "@/utils/axios-interceptor";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

function JournalDetail() {
  const { requestUnlock } = useJournalUnlock();
  const [journal, setJournal] = useState(null);
  const { id } = useParams();
  console.log(id);

  const loadJournal = async () => {
    try {
      const token = await requestUnlock();
      const res = await api.get(`/journal/${id}`, {
        headers: {
          "x-unlock-token": token,
        },
      });

      if (res.status === 401) {
        return loadJournal();
      }

      console.log(await res.data);
      setJournal(await res.data.data);
    } catch (error) {
      console.error("Failed to load journal", error);
    }
  };

  useEffect(() => {
    loadJournal();
  }, [id]);

  return (
    <div>{journal ? <JournalDetailCard data={journal} /> : "Loading..."}</div>
  );
}

export default JournalDetail;

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

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
