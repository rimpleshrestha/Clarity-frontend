import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PromptCard } from "@/(authenticated)/_components/PromptCard";
import { useDailyPromptStore } from "@/utils/store";
import { getDailyPrompts } from "@/utils/gemini";

type Prompt = {
  id: number;
  category: string;
  question: string;
  color: string;
  categoryColor: string;
};

export const PromptSwipePage = () => {
  const navigate = useNavigate();
  const setDailyPrompt = useDailyPromptStore((s) => s.setPrompt);

  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  const currentPrompt = prompts[currentIndex];

  useEffect(() => {
    async function loadPrompts() {
      try {
        const aiPrompts = await getDailyPrompts(15);

        setPrompts(
          aiPrompts.map((p: any, i: number) => ({
            id: i + 1,
            category: p.category,
            question: p.question,
            color: "#E9D8FD",
            categoryColor: "#805AD5",
          }))
        );
      } finally {
        setLoading(false);
      }
    }

    loadPrompts();
  }, []);

  const handleSwipe = (direction: "left" | "right") => {
    if (!currentPrompt) return;

    if (direction === "right") {
      setDailyPrompt({
        question: currentPrompt.question,
        category: currentPrompt.category,
      });

      navigate("/dashboard");
      return;
    }

    if (currentIndex < prompts.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setShowPopup(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading daily prompts…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Daily Prompt</h1>
          <p className="text-muted-foreground">Choose one prompt for today</p>
        </div>

        <div className="relative h-[400px] mb-8">
          <AnimatePresence>
            {currentPrompt && (
              <PromptCard
                key={currentPrompt.id}
                prompt={currentPrompt}
                onSwipe={handleSwipe}
              />
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-6">
          <Button
            size="lg"
            variant="outline"
            className="w-16 h-16 rounded-full border-2 border-red-500"
            onClick={() => handleSwipe("left")}
          >
            <X className="w-6 h-6 text-red-500" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="w-16 h-16 rounded-full border-2 border-green-500"
            onClick={() => handleSwipe("right")}
          >
            <Check className="w-6 h-6 text-green-500" />
          </Button>
        </div>

        <div className="mt-8">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-purple-500 h-2 rounded-full"
              animate={{
                width: `${((currentIndex + 1) / prompts.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* WOW POPUP */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border border-purple-200 flex flex-col items-center"
              initial={{ y: 100, scale: 0.8, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 100, scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 15 }}
            >
              {/* Gradient Circle Icon */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-400 to-blue-400 flex items-center justify-center mb-4 shadow-lg">
                <Check className="w-10 h-10 text-white" />
              </div>

              <h2 className="text-xl font-bold text-purple-700 mb-2">
                You are out of prompts for today!
              </h2>
              <p className="text-gray-600 mb-6">
                Come back tomorrow for more daily prompts to continue your
                journaling journey.
              </p>

              <Button
                className="bg-purple-600 hover:bg-purple-700 text-white w-full shadow-lg"
                onClick={() => setShowPopup(false)}
              >
                Close
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PromptSwipePage;
