import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CustomSelect from "@/Test";
import { useMutation, useQueries } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { createJournal, getMoods, getTags } from "../api";
import { journalSchema, type JournalType } from "@/utils/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const form = useForm<JournalType>({
    defaultValues: {
      title: "",
      entry: "",
      mood_id: "",
      tag_id: "",
    },
    resolver: zodResolver(journalSchema),
  });

  const [moodQuery, tagQuery] = useQueries({
    queries: [
      { queryKey: ["moods"], queryFn: getMoods },
      { queryKey: ["tags"], queryFn: getTags },
    ],
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["create-journal"],
    mutationFn: createJournal,
  });
  console.log(form.formState.errors);
  const onSubmit = (values: any) => {
    console.log(values);
    mutate(values, {
      onSuccess: (data) => {
        console.log("Journal created successfully:", data);
        toast.success("Journal created successfully");
      },
      onError: (error) => {
        console.error("Error creating journal:", error);
        toast.error("Error creating journal");
      },
    });
  };

  return (
    <div className="p-10">
      <div className="flex my-6 justify-end w-full">
        <Button type="submit" disabled={isPending} form="dashboard-form">
          Save Prompt {isPending && <Loader2 className="ml-2 animate-spin" />}
        </Button>
      </div>

      <div className="flex flex-col gap-5">
        <Card className="bg-primary">
          <CardHeader>
            <CardTitle>Today’s prompt:</CardTitle>
            <CardDescription>
              How would you like to start your day today?
            </CardDescription>
          </CardHeader>
        </Card>

        <Form {...form}>
          <form
            id="dashboard-form"
            className="w-full space-y-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <Card className="min-h-full bg-primary">
              <CardHeader>
                <CardTitle className="flex gap-2 items-center">
                  Title:
                  <Input
                    {...form.register("title")}
                    className="w-full bg-transparent ring-0 border-none shadow-none"
                  />
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="flex gap-5 justify-between items-center">
                  <CustomSelect
                    name="mood_id"
                    control={form.control}
                    placeholder="Search a mood.."
                    data={moodQuery.data?.data ?? []}
                    isLoading={moodQuery.isPending}
                  />

                  <CustomSelect
                    name="tag_id"
                    control={form.control}
                    placeholder="Search a tag..."
                    data={tagQuery.data?.data ?? []}
                    isLoading={tagQuery.isPending}
                  />
                </div>

                <div className="mt-4">
                  <Label className="mb-2 block">Entry</Label>
                  <textarea
                    {...form.register("entry")}
                    rows={24}
                    className="rounded-2xl w-full p-4"
                    placeholder="Enter your thoughts..."
                  />
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Dashboard;
