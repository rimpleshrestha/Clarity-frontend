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
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
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
    </div>
  );
};

export default PromptSwipePage;
