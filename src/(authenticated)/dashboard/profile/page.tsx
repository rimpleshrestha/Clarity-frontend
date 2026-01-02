import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useProfileMutations } from "@/hooks/useProfileMutations";
import { getMe } from "./user-api";
import { Link } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ChangePasswordForm from "../change-password/page";

const ProfilePage = () => {
  const queryClient = useQueryClient();

  /* ---------- FETCH USER ---------- */
  const { data, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  const user = data?.user;

  /* ---------- LOCAL STATE ---------- */
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);

  /* ---------- SYNC STATE ---------- */
  useEffect(() => {
    if (user) {
      setName(user.name);
      setBio(user.bio ?? "");
    }
  }, [user]);

  const { updateDetails, updateProfilePic, updateCoverPic } =
    useProfileMutations();

  /* ---------- IMAGE UPLOAD (OPTIMISTIC) ---------- */
  const handleImageUpload = (file: File, type: "profile" | "cover") => {
    const formData = new FormData();
    const previewUrl = URL.createObjectURL(file);

    if (type === "profile") {
      formData.append("pfp", file);
      setProfilePreview(previewUrl);
    } else {
      formData.append("cover", file);
      setCoverPreview(previewUrl);
    }

    const mutation = type === "profile" ? updateProfilePic : updateCoverPic;

    mutation.mutate(formData, {
      onSuccess: () => {
        toast.success(`${type} image updated`);
        queryClient.invalidateQueries({ queryKey: ["me"] });
      },
      onError: () => {
        toast.error("Image update failed");
        if (type === "profile") setProfilePreview(null);
        else setCoverPreview(null);
      },
      onSettled: () => {
        URL.revokeObjectURL(previewUrl);
      },
    });
  };

  /* ---------- DETAILS SAVE ---------- */
  const handleSaveDetails = () => {
    updateDetails.mutate(
      { name, bio },
      {
        onSuccess: () => {
          toast.success("Profile updated");
          setIsEditing(false);
          queryClient.invalidateQueries({ queryKey: ["me"] });
        },
        onError: () => toast.error("Update failed"),
      }
    );
  };

  if (isLoading) return <p>Loading profile...</p>;
  if (!user) return <p>User not found</p>;

  return (
    <div className="p-10">
      {/* ---------- COVER IMAGE ---------- */}
      <div className="relative h-40 rounded-lg overflow-hidden">
        {coverPreview || user.cover_picture ? (
          <img
            src={coverPreview ?? user.cover_picture}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-muted to-secondary" />
        )}

        <input
          type="file"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={(e) =>
            e.target.files && handleImageUpload(e.target.files[0], "cover")
          }
        />
      </div>

      {/* ---------- PROFILE IMAGE ---------- */}
      <div className="relative w-24 h-24 -mt-12 ml-6">
        {profilePreview || user.profile_picture ? (
          <img
            src={profilePreview ?? user.profile_picture}
            className="w-24 h-24 rounded-full border-4 border-background object-cover"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
            No Image
          </div>
        )}

        <input
          type="file"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={(e) =>
            e.target.files && handleImageUpload(e.target.files[0], "profile")
          }
        />
      </div>

      {/* ---------- USER INFO ---------- */}
      <div className="mt-6 space-y-4">
        <div>
          <label className="text-sm text-muted-foreground">Name</label>
          <Input
            value={name}
            disabled={!isEditing}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Email</label>
          <Input value={user.email} disabled />
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Bio</label>
          <Input
            value={bio}
            disabled={!isEditing}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>
        {/* <Link to="/dashboard/change-password">
          <Button variant="outline">Change Password</Button>
        </Link> */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Change Password</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
            </DialogHeader>

            <div className="mt-4">
              <ChangePasswordForm />
            </div>
          </DialogContent>
        </Dialog>

        {/* ---------- ACTIONS ---------- */}
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>Edit profile</Button>
        ) : (
          <div className="flex gap-3">
            <Button
              onClick={handleSaveDetails}
              disabled={updateDetails.isPending}
            >
              Confirm changes
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                setName(user.name);
                setBio(user.bio ?? "");
              }}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
