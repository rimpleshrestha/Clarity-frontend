import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader, Loader2, Star, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { deleteJournal } from "../api";

const JournalCard = ({
  title,
  description,
  tag,
  refetch,
  id,
}: {
  title: string;
  description: string;
  tag: string;
  id: string;
  refetch?: () => void;
}) => {
  const { mutate, isPending } = useMutation({
    mutationFn: deleteJournal,
  });

  return (
    <Card className="w-full bg-primary">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {title}
          <Star className="text-muted-foreground" />
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {description}
        </CardDescription>

        <CardFooter className="flex justify-between gap-2 items-center">
          {isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Trash
              onClick={() =>
                mutate(Number(id), {
                  onSuccess: () => {
                    refetch && refetch();
                  },
                })
              }
              className="cursor-pointer text-red-600"
            />
          )}

          <div>
            <Badge variant={"secondary"}>{tag}</Badge>
          </div>
        </CardFooter>
      </CardHeader>
    </Card>
  );
};

export default JournalCard;
