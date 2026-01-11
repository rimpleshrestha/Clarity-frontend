// components/JournalForm.tsx
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { journalSchema, type JournalType } from "@/utils/zod-schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import CustomSelect from "@/Test";
import CustomTextEditor from "@/components/CustomTextEditor";

interface JournalFormProps {
  initialData?: JournalType;
  onSubmit: (values: JournalType) => void;
  isLoading: boolean;
  moods: any[];
  tags: any[];
}

export function JournalForm({
  initialData,
  onSubmit,
  isLoading,
  moods,
  tags,
}: JournalFormProps) {
  const form = useForm<JournalType>({
    defaultValues: initialData || {
      title: "",
      entry: "",
      mood_id: "",
      tag_id: "",
    },
    resolver: zodResolver(journalSchema),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="bg-primary">
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              Title:
              <Input
                {...form.register("title")}
                className="bg-white text-black"
              />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-5 max-lg:flex-col max-lg:items-start justify-between items-center">
              <CustomSelect
                name="mood_id"
                control={form.control}
                data={moods}
                label="Mood"
                placeholder="Mood"
              />
              <CustomSelect
                name="tag_id"
                control={form.control}
                data={tags}
                label="Tag"
                placeholder="Tag"
              />
            </div>
            <div>
              <Label>Entry</Label>
              <Controller
                name="entry"
                control={form.control}
                render={({ field }) => (
                  <CustomTextEditor
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-fit">
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
