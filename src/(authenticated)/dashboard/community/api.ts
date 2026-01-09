import api from "@/utils/axios-interceptor";

export const getAllPosts = async () => {
  const res = await api.get("/posts");
  return res.data;
};

export const createPost = async (data: { content: string; image?: File }) => {
  const formData = new FormData();
  formData.append("content", data.content);
  if (data.image) formData.append("image", data.image);

  const res = await api.post("/posts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updatePost = async (data: {
  id: string | number;
  content: string;
  image?: File;
}) => {
  const formData = new FormData();
  formData.append("content", data.content);
  if (data.image) formData.append("image", data.image);

  const res = await api.put(`/posts/${data.id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deletePost = async (id: number) => {
  const res = await api.delete(`/posts/${id}`);
  return res.data;
};

export const toggleLike = async (id: number) => {
  const res = await api.post(`/posts/${id}/like`);
  return res.data;
};
