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
      await queryClient.cancelQueries({ queryKey: ["journals"] });
      const previousJournals = queryClient.getQueryData(["journals"]);
      queryClient.setQueryData(["journals"], (old: any) => ({
        ...old,
        data: old.data.filter((item: any) => item.id !== deletedId),
      }));
      return { previousJournals };
    },
    onSuccess: () => {
      toast.success("Deleted");
    },
    onError: (err, deletedId, context) => {
      queryClient.setQueryData(["journals"], context?.previousJournals);
      toast.error("Failed to delete journal");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["journals"] });
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
              onClick={() => toggleSave(Number(id))}
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
                onClick={() => mutate(Number(id))}
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
