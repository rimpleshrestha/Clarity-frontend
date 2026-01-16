import { MoreVertical, Trash2, Edit2, Heart } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deletePost, toggleLike } from "../dashboard/community/api";
import { useNavigate } from "react-router";
import { Card } from "@/components/ui/card";
import {jwtDecode} from "jwt-decode";

const PostCard = ({ post }: any) => {
  const queryClient = useQueryClient();
  const router = useNavigate();

  // --- OPTIMISTIC DELETE ---
  const deleteMutate = useMutation({
    mutationFn: () => deletePost(post.id),
    onMutate: async () => {
      // 1. Cancel outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      // 2. Snapshot the previous value
      const previousPosts = queryClient.getQueryData(["posts"]);

      // 3. Optimistically update by removing the post
      queryClient.setQueryData(["posts"], (old: any) =>
        old?.filter((p: any) => p.id !== post.id)
      );

      return { previousPosts };
    },
    onError: (err, variables, context) => {
      // 4. Rollback if it fails
      queryClient.setQueryData(["posts"], context?.previousPosts);
      toast.error("Failed to delete post");
    },
    onSettled: () => {
      // 5. Always refetch after error or success to ensure sync
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onSuccess: () => {
      toast.success("Post deleted");
    },
  });

  // --- OPTIMISTIC LIKE ---
  const likeMutate = useMutation({
    mutationFn: () => toggleLike(post.id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      const previousPosts = queryClient.getQueryData(["posts"]);

      queryClient.setQueryData(["posts"], (old: any) =>
        old?.map((p: any) => {
          if (p.id === post.id) {
            return {
              ...p,
              isLiked: !p.isLiked,
              likeCount: p.isLiked ? p.likeCount - 1 : p.likeCount + 1,
            };
          }
          return p;
        })
      );

      return { previousPosts };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["posts"], context?.previousPosts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
const {user_id} = jwtDecode(localStorage.getItem("access_token") || "");
const isAuthor = user_id === post.author.id;
  return (
    <Card className=" rounded-3xl p-5  flex flex-col gap-4">
      <div className="flex justify-between">
        <div className="flex gap-3">
          <img
            src={post.author.profile_picture || "/avatar.png"}
            className="w-10 h-10 rounded-full object-cover"
            alt="avatar"
          />
          <div>
            <p className="font-bold text-card-foreground">{post.author.name}</p>
          </div>
        </div>
        {isAuthor && (
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <MoreVertical size={18} className="text-slate-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() =>
                  router(`/dashboard/community?edit=true&id=${post.id}`)
                }
                className="cursor-pointer"
              >
                <Edit2 size={14} className="mr-2" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => deleteMutate.mutate()}
                className="text-red-600 cursor-pointer"
              >
                <Trash2 size={14} className="mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <p className="text-card-foreground leading-relaxed">{post.content}</p>

      {post.image && (
        <img
          src={post.image}
          className="rounded-2xl w-full h-48 object-cover"
          alt="Post content"
        />
      )}

      <div className="mt-auto pt-4 flex items-center gap-4">
        <button
          onClick={() => likeMutate.mutate()}
          disabled={likeMutate.isPending} // Prevent double clicks
          className={`flex items-center gap-1.5 transition-colors ${
            post.isLiked
              ? "text-red-500"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Heart size={20} fill={post.isLiked ? "currentColor" : "none"} />
          <span className="text-sm font-semibold">{post.likeCount}</span>
        </button>
      </div>
    </Card>
  );
};

export default PostCard;
