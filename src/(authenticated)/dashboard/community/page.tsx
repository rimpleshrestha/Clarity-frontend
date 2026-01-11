"use client";

import { useQuery } from "@tanstack/react-query";
import CommunityForm from "@/(authenticated)/_components/CommunuityPost";
import PostCard from "@/(authenticated)/_components/PostCard";

import { Loader2 } from "lucide-react";
import { useSearchParams } from "react-router";
import { getAllPosts } from "./api";

const CommunityPage = () => {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("id");
  const isEditing = searchParams.get("edit") === "true";

  const {
    data: posts,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: getAllPosts,
  });

  // Find the post data if we are in edit mode
  const postToEdit = isEditing
    ? posts?.find((p: any) => p.id === Number(editId))
    : null;

  if (isLoading)
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className=" w-full lg:max-w-7xl mx-0 lg:mx-auto">
      <h1 className="text-2xl mb-2 font-bold px-2 lg:px-10 text-card-foreground ">
        Talk to the Community
      </h1>
      <div className="">
        <CommunityForm
          refetch={refetch}
          isEditing={isEditing}
          initialData={postToEdit}
        />
      </div>

      <h1 className="text-2xl font-bold px-2 lg:px-10 text-card-foreground my-6">
        Recent Updates
      </h1>

      <div className="px-2 lg:px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts?.map((post: any) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default CommunityPage;
