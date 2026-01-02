// src/hooks/useProfileMutations.ts
import { useMutation } from "@tanstack/react-query";
import {
  updateUserDetails,
  updateProfileImage,
  updateCoverImage,
} from "@/(authenticated)/dashboard/profile/user-api";

export const useProfileMutations = () => {
  const updateDetails = useMutation({
    mutationFn: updateUserDetails,
  });

  const updateProfilePic = useMutation({
    mutationFn: updateProfileImage,
  });

  const updateCoverPic = useMutation({
    mutationFn: updateCoverImage,
  });

  return {
    updateDetails,
    updateProfilePic,
    updateCoverPic,
  };
};
