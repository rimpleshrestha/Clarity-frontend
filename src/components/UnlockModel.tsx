import { useJournalUnlock } from "@/contexts/LockContext";
import api from "@/utils/axios-interceptor";
import { useState } from "react";

export const UnlockModal = () => {
  const { showModal, unlock } = useJournalUnlock();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/unlock-journal", {
        pin: pin,
      });

      const data = await res.data;
      if (!res.status) throw new Error(data.message);

      unlock(data.data["unlock-token"]);
      setPin("");
    } catch (err: any) {
      setError(err.message || "Invalid PIN");
    } finally {
      setLoading(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">🔒 Enter PIN</h2>
        <form onSubmit={handleUnlock}>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-2"
            placeholder="PIN"
            autoFocus
          />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            {loading ? "Unlocking..." : "Unlock"}
          </button>
        </form>
      </div>
    </div>
  );
};
