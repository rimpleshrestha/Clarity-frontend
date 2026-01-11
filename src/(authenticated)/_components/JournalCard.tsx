import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Star, Trash } from "lucide-react";
import { deleteJournal, saveJournal } from "../api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Link } from "react-router";

const JournalCard = ({
  title,
  description,
  tag,
  id,
  is_favorate,
}: {
  title: string;
  description: string;
  tag: string;
  id: string;
  is_favorate: boolean;
}) => {
  const queryClient = useQueryClient(); // Use the existing QueryClient

  const { mutate, isPending } = useMutation({
    mutationFn: deleteJournal,
    onMutate: async (deletedId) => {
      // 1. Cancel outgoing refetches for both lists
      await queryClient.cancelQueries({ queryKey: ["journals"] });
      await queryClient.cancelQueries({ queryKey: ["saved-journals"] });

      // 2. Snapshot the previous values
      const previousJournals = queryClient.getQueryData(["journals"]);
      const previousSaved = queryClient.getQueryData(["saved-journals"]);

      // 3. Optimistically update "journals"
      queryClient.setQueriesData({ queryKey: ["journals"] }, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.filter((item: any) => item.id !== deletedId),
        };
      });

      // 4. Optimistically update "saved-journals"
      queryClient.setQueriesData(
        { queryKey: ["saved-journals"] },
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((item: any) => item.id !== deletedId),
          };
        }
      );

      return { previousJournals, previousSaved };
    },
    onSuccess: () => {
      toast.success("Deleted successfully");
    },
    onError: (err, deletedId, context) => {
      // Rollback
      queryClient.setQueryData(["journals"], context?.previousJournals);
      queryClient.setQueryData(["saved-journals"], context?.previousSaved);
      toast.error("Failed to delete journal");
    },
    onSettled: () => {
      // 🔥 Crucial: Invalidate ALL queries starting with these keys
      queryClient.invalidateQueries({ queryKey: ["journals"] });
      queryClient.invalidateQueries({ queryKey: ["saved-journals"] });
    },
  });
  const { mutate: toggleSave, isPending: isSaving } = useMutation({
    mutationFn: saveJournal,

    onMutate: async (journalId: number) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["journals"] }),
        queryClient.cancelQueries({ queryKey: ["saved-journals"] }),
      ]);

      const previousJournals = queryClient.getQueryData<any>(["journals"]);
      const previousSaved = queryClient.getQueryData<any>(["saved-journals"]);

      // 1️⃣ Update ALL journals
      queryClient.setQueryData(["journals"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((j: any) =>
            j.id === journalId ? { ...j, is_favorate: !j.is_favorate } : j
          ),
        };
      });

      // 2️⃣ Update SAVED journals
      queryClient.setQueryData(["saved-journals"], (old: any) => {
        if (!old) return old;

        const journal = old.data.find((j: any) => j.id === journalId);

        if (journal) {
          return {
            ...old,
            data: old.data.filter((j: any) => j.id !== journalId),
          };
        }

        const fromAll = previousJournals?.data.find(
          (j: any) => j.id === journalId
        );

        if (!fromAll) return old;

        return {
          ...old,
          data: [{ ...fromAll, is_favorate: true }, ...old.data],
        };
      });

      return { previousJournals, previousSaved };
    },

    onError: (_err, _id, context) => {
      queryClient.setQueryData(["journals"], context?.previousJournals);
      queryClient.setQueryData(["saved-journals"], context?.previousSaved);
      toast.error("Failed to update favorite");
    },

    onSuccess: (data: any) => {
      toast.success(data.message);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["journals"] });
      queryClient.invalidateQueries({ queryKey: ["saved-journals"] });
    },
  });

  return (
    <Link to={"/dashboard/journal/" + id}>
      <Card className="w-full bg-primary">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            {title}
            <Star
              onClick={(e) => {
                e.preventDefault(); // Prevents the Link from triggering
                e.stopPropagation();
                toggleSave(Number(id));
              }}
              className={cn(
                "cursor-pointer transition",
                is_favorate
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-muted-foreground"
              )}
            />
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {description}
          </CardDescription>
          <CardFooter className="flex justify-between gap-2 items-center">
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Trash
                onClick={(e) => {
                  e.preventDefault(); // Prevents the Link from triggering
                  e.stopPropagation();
                  mutate(Number(id));
                }}
                className="cursor-pointer text-red-600"
              />
            )}
            <div>
              <Badge variant={"secondary"}>{tag}</Badge>
            </div>
          </CardFooter>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default JournalCard;
