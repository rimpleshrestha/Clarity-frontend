import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Added for the motto/bio
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useProfileMutations } from "@/hooks/useProfileMutations";
import { getMe } from "./user-api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ChangePasswordForm from "../change-password/page";
import { Camera } from "lucide-react";

const ProfilePage = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  const user = data?.user;

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setBio(user.bio ?? "");
    }
  }, [user]);

  const { updateDetails, updateProfilePic, updateCoverPic } =
    useProfileMutations();

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
      onSettled: () => URL.revokeObjectURL(previewUrl),
    });
  };

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

  if (isLoading) return <p className="p-10 text-center">Loading profile...</p>;
  if (!user) return <p className="p-10 text-center">User not found</p>;

  return (
    <div className="min-h-screen bg-[#F9F9F4] pb-20 font-sans">
      <div className=" px-4">
        {/* HERO AREA */}
        <div className="relative mb-8">
          {/* Cover Image */}
          <div className="relative h-70 rounded-xl overflow-hidden group">
            {coverPreview || user.cover_picture ? (
              <img
                src={coverPreview ?? user.cover_picture}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <div className="w-full h-full bg-[#E0E7FF]" />
            )}
            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
              onChange={(e) =>
                e.target.files && handleImageUpload(e.target.files[0], "cover")
              }
            />
            <div className="absolute top-2 right-2 bg-white/80 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs font-medium">Change Cover</span>
            </div>
          </div>

          {/* Profile Image & Greeting */}
          <div className="flex items-start gap-4 -mt-10 ml-6 relative z-20">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full border-4 border-[#F9F9F4] overflow-hidden bg-gray-200">
                <img
                  src={
                    profilePreview ??
                    user.profile_picture ??
                    "/placeholder-user.jpg"
                  }
                  className="w-full h-full object-cover"
                />
              </div>
              <label className="absolute bottom-0 right-0 bg-[#B5B2FF] p-2 rounded-full cursor-pointer border-2 border-[#F9F9F4]">
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files &&
                    handleImageUpload(e.target.files[0], "profile")
                  }
                />
                <Camera className="w-4 h-4 text-white " />
              </label>
            </div>

            <div className="pt-12">
              <h2 className="text-2xl font-bold text-[#5B86E5]">
                Hi, {user.name.split(" ")[0]}
              </h2>
              <p className="text-xs text-gray-600 mt-1 max-w-xs leading-tight">
                {user.bio || "No motto set. Edit your profile to add one!"}
              </p>
            </div>
          </div>
        </div>

        {/* MAIN FORM CARD */}
        <div className="bg-white  mx-20 rounded-[2.5rem] border-2 border-[#D1D5DB] p-8 shadow-sm">
          <h3 className="text-2xl font-bold text-[#433D8B] mb-6">
            Edit Profile
          </h3>

          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-800 ml-1">
                Full Name
              </label>
              <Input
                value={name}
                disabled={!isEditing}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl border-gray-300 text-black h-12 focus-visible:ring-[#433D8B]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-800 ml-1">
                Email Address
              </label>
              <Input
                value={user.email}
                disabled
                className="rounded-xl border-gray-300 h-12 text-black bg-gray-50 opacity-70"
              />
            </div>

            <div className="space-y-1.5 relative">
              <label className="text-sm font-bold text-gray-800 ml-1">
                Daily Motto
              </label>
              <div className="relative">
                <Textarea
                  value={bio}
                  disabled={!isEditing}
                  onChange={(e) => setBio(e.target.value)}
                  className="rounded-xl border-gray-300 text-black min-h-[100px] pt-3 focus-visible:ring-[#433D8B] resize-none"
                />
              </div>
            </div>
            {/* Change Password Button Overlaying the Motto field slightly like in UI */}
            <div className="flex gap-2 items-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-8 text-xs bg-[#F0EEFF] border-[#D1D1F5] hover:bg-[#E2E0FF] text-[#433D8B] rounded-lg"
                  >
                    Change Password
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                  </DialogHeader>
                  <ChangePasswordForm />
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="h-8 text-xs  rounded-lg"
                  >
                    Delete My Account
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Are you sure you want to delete your account?
                    </DialogTitle>
                  </DialogHeader>
                  <div>
                    <p className="mb-4">
                      This action is irreversible. All your data will be lost.
                    </p>
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => {
                        toast.error("Account deletion not implemented yet.");
                      }}
                    >
                      Yes, Delete My Account
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            {/* ACTION BUTTONS */}
            <div className="flex gap-4 pt-4">
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 h-12 bg-[#433D8B] hover:bg-[#35306E] rounded-xl text-lg font-semibold"
                >
                  Edit profile
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setName(user.name);
                      setBio(user.bio ?? "");
                    }}
                    className="flex-1 h-12 rounded-xl border-2 text-lg font-semibold"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveDetails}
                    disabled={updateDetails.isPending}
                    className="flex-1 h-12 bg-[#433D8B] hover:bg-[#35306E] rounded-xl text-lg font-semibold"
                  >
                    Save Changes
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
