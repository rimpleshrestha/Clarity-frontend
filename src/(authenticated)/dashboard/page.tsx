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
import { Controller, useForm } from "react-hook-form";
import { createJournal, getMoods, getTags } from "../api";
import { journalSchema, type JournalType } from "@/utils/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useDailyPromptStore } from "@/utils/store";
import CustomTextEditor from "@/components/CustomTextEditor";

const Dashboard = () => {
  const form = useForm<JournalType>({
    defaultValues: {
      title: "",
      entry: "",
      mood_id: "",
      tag_id: "",
    },
    resolver: zodResolver(journalSchema),
    mode: "onChange",
  });

  const [moodQuery, tagQuery] = useQueries({
    queries: [
      {
        queryKey: ["moods"],
        queryFn: getMoods,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ["tags"],
        queryFn: getTags,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      },
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
  const { question, category } = useDailyPromptStore();
  console.log("watch", form.formState.errors);
  return (
    <div className="p-10">
      <div className="flex my-6 justify-end w-full">
        <Button type="submit" disabled={isPending} form="dashboard-form">
          Save Journal {isPending && <Loader2 className="ml-2 animate-spin" />}
        </Button>
      </div>

      <div className="flex flex-col gap-5">
        {question && (
          <Card className="p-6 bg-primary">
            <p className="text-sm text-muted-foreground ">
              Daily Prompt • {category}
            </p>
            <h2 className="text-xl font-semibold m-0">{question}</h2>
          </Card>
        )}
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
                  <Controller
                    name="entry"
                    control={form.control}
                    render={({ field }) => (
                      <>
                        <CustomTextEditor
                          value={field.value} // editor displays current HTML
                          onChange={(text) => {
                            field.onChange(text); // RHF sees plain text
                          }}
                        />
                        {form.formState.errors.entry && (
                          <span className="text-red-500">
                            {form.formState.errors.entry.message}
                          </span>
                        )}
                      </>
                    )}
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
