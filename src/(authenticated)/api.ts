import api from "@/utils/axios-interceptor";

const getMoods = async () => {
  const res = await api.get("/mood");
  return await res.data;
};

const getTags = async () => {
  const res = await api.get("/tags");
  return await res.data;
};

const createJournal = async (data: any) => {
  const res = await api.post(
    "/journal",
    {
      title: data.title,
      entry: data.entry,
      mood_id: Number(data.mood_id),
      tag_id: [Number(data.tag_id)],
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  console.log(res);
  return await res.data;
};

const getJournals = async () => {
  const res = await api.get("/journal");
  return await res.data;
};
const deleteJournal = async (id: number) => {
  const res = await api.delete(`/journal/${id}`);
  return await res.data;
};
const saveJournal = async (id: number) => {
  const res = await api.patch(`/journal/${id}/save`);
  return res.data;
};
const getSavedJournals = async () => {
  const res = await api.get("/journal", {
    params: {
      is_favorite: true,
    },
  });
  return res.data;
};

export {
  getMoods,
  getTags,
  createJournal,
  getJournals,
  deleteJournal,
  saveJournal,
  getSavedJournals,
};
