import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { X, Check } from "lucide-react";

interface PromptCardProps {
  prompt: {
    id: number;
    category: string;
    question: string;
    color: string;
    categoryColor: string;
  };
  onSwipe: (direction: "left" | "right") => void;
  style?: any;
}

export const PromptCard = ({ prompt, onSwipe, style }: PromptCardProps) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-25, 0, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  // Icon opacity based on swipe direction
  const leftIconOpacity = useTransform(x, [-100, 0], [1, 0]);
  const rightIconOpacity = useTransform(x, [0, 100], [0, 1]);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 100) {
      onSwipe("right");
    } else if (info.offset.x < -100) {
      onSwipe("left");
    }
  };

  return (
    <motion.div
      style={{
        x,
        rotate,
        opacity,
        position: "absolute",
        cursor: "grab",
        ...style,
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileDrag={{ cursor: "grabbing" }}
      className="w-full "
    >
      <Card
        className="w-full h-[400px] rounded-2xl relative overflow-hidden shadow-xl"
        style={{ backgroundColor: prompt.color }}
      >
        {/* Left Swipe Indicator (X) */}
        <motion.div
          style={{ opacity: leftIconOpacity }}
          className="absolute top-8 right-8 z-10"
        >
          <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center rotate-12 border-4 border-white">
            <X className="w-12 h-12 text-white" strokeWidth={4} />
          </div>
        </motion.div>

        {/* Right Swipe Indicator (Check) */}
        <motion.div
          style={{ opacity: rightIconOpacity }}
          className="absolute top-8 left-8 z-10"
        >
          <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center -rotate-12 border-4 border-white">
            <Check className="w-12 h-12 text-white" strokeWidth={4} />
          </div>
        </motion.div>

        <CardHeader className="flex flex-col justify-center h-full w-full items-center p-8">
          <span
            className="text-center text-sm font-medium mb-4"
            style={{ color: prompt.categoryColor }}
          >
            {prompt.category}
          </span>
          <CardTitle className="text-2xl font-semibold text-center text-gray-800">
            {prompt.question}
          </CardTitle>
        </CardHeader>
      </Card>
    </motion.div>
  );
};
