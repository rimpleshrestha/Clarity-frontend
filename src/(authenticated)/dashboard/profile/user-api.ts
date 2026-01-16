import api from "@/utils/axios-interceptor";

/* ----------------------------------
   Get current user (optional but useful)
----------------------------------- */
const getMe = async () => {
  const res = await api.get("/me");
  return res.data;
};

/* ----------------------------------
   Update user details (name, bio)
----------------------------------- */
const updateUserDetails = async (data: { name?: string; bio?: string }) => {
  const res = await api.put("/user/update-details", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res.data;
};

/* ----------------------------------
   Update profile picture
----------------------------------- */
const updateProfileImage = async (formData: FormData) => {
  const res = await api.put("/user/update-profile-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

/* ----------------------------------
   Update cover picture
----------------------------------- */
const updateCoverImage = async (formData: FormData) => {
  const res = await api.put("/user/update-cover-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

/* ----------------------------------
   Change password
----------------------------------- */
const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  const res = await api.put("/user/change-password", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res.data;
};
const deleteUserAccount = async () => {
  const res = await api.delete("/user/delete-account");
  return res.data;
};
export {
  getMe,
  updateUserDetails,
  updateProfileImage,
  updateCoverImage,
  changePassword,
  deleteUserAccount,
};
