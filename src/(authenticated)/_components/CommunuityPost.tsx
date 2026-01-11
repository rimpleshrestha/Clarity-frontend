"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Camera, Loader2, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createPost, updatePost } from "../dashboard/community/api";
import { useNavigate } from "react-router";

const postSchema = z.object({
  content: z.string().min(1, "Cannot be empty").max(1000),
});

const CommunityForm = ({ isEditing, refetch, initialData }: any) => {
  const queryClient = useQueryClient();
  const router = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: { content: "" },
  });

  // Effect to fill form when editing
  useEffect(() => {
    if (isEditing && initialData) {
      form.setValue("content", initialData.content);
      if (initialData.image) setPreviewUrl(initialData.image);
    }
  }, [isEditing, initialData, form]);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) =>
      isEditing
        ? updatePost({ id: initialData.id, ...data })
        : createPost(data),
    onSuccess: () => {
      toast.success(isEditing ? "Post updated" : "Post shared");
      handleCancel();
      refetch();
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleCancel = () => {
    form.reset();
    setSelectedImage(null);
    setPreviewUrl(null);
    if (isEditing) router("/dashboard/community");
  };

  const onSubmit = (values: any) => mutate({ ...values, image: selectedImage });

  return (
    <div className="p-3  max-w-2xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="rounded-[2rem] border-muted shadow-sm overflow-hidden">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">
                  {isEditing ? "Edit your post" : "How are you feeling today?"}
                </h2>
                <input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedImage(file);
                      setPreviewUrl(URL.createObjectURL(file));
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-slate-400"
                >
                  <Camera size={20} />
                </button>
              </div>

              {previewUrl && (
                <div className="relative w-24 h-24 rounded-xl overflow-hidden">
                  <img
                    src={previewUrl}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => {
                      setPreviewUrl(null);
                      setSelectedImage(null);
                    }}
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}

              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Share your thoughts..."
                          className="rounded-xl h-12"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-[#4F39F6] rounded-xl h-12"
                >
                  {isPending ? (
                    <Loader2 className="animate-spin" />
                  ) : isEditing ? (
                    "Update"
                  ) : (
                    "Post"
                  )}
                </Button>
                {isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="rounded-xl h-12"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default CommunityForm;
