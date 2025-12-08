import { Cloud, Lightbulb, LockKeyhole } from "lucide-react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader } from "./components/ui/card";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#F3F9FF] from-0% via-[#E8F0FF] via-40% to-[#8BAADE] to-100% flex justify-center items-center flex-col px-4 py-8 md:py-12 lg:py-16 relative overflow-hidden">
      <div className="flex justify-center flex-col items-center">
        <div className="flex gap-2 items-center mb-10">
          <img src="logo.png" className="size-[60px]" />{" "}
          <span className="font-semibold text-3xl bg-linear-to-b from-[#A875DF] to-[#8BAADE] bg-clip-text text-transparent">
            Clarity
          </span>
        </div>
        <h1 className="text-[#422DB5] text-6xl">
          Your space to think clearly.
        </h1>
        <p className="max-w-3xl text-wrap text-center mt-12 text-black/60">
          A minimal journaling experience designed for focus, privacy, and peace
          of mind. Capture your thoughts in a distraction-free environment.
        </p>
        <Button className="mt-12">Start Journaling</Button>
      </div>
      <div className="grid max-w-7xl gap-12 grid-cols-1 mt-12 md:grid-col-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <span className="p-2 w-fit text-[#6B6B6B] bg-[#F3F9FF] rounded-md flex items-center justify-center">
              <LockKeyhole />
            </span>
          </CardHeader>
          <CardContent className="text-[#6B6B6B]">
            <span className="text-center block">Private & Secure</span>
            <span className="text-center block">
              Your thoughts are safe here. Optional PIN lock and local storage
              keep your entries protected.
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <span className="p-2 w-fit text-[#6B6B6B] bg-[#F3F9FF] rounded-md flex items-center justify-center">
              <Cloud />
            </span>
          </CardHeader>
          <CardContent className="text-[#6B6B6B]">
            <span className="text-center block">Auto-Save </span>
            <span className="text-center block">
              Never lose your thoughts. Every word is automatically saved as you
              write.
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <span className="p-2 w-fit text-[#6B6B6B] bg-[#F3F9FF] rounded-md flex items-center justify-center">
              <Lightbulb />
            </span>
          </CardHeader>
          <CardContent className="text-[#6B6B6B]">
            <span className="text-center block">Daily-Prompts</span>
            <span className="text-center block">
              Get inspired with thoughtful prompts. Build a journaling habit
              that sticks.
            </span>
          </CardContent>
        </Card>
      </div>
      <span className="text-center mt-20 text-[#171616]">
        A minute of clarity can change your day.
      </span>
      <div className="bg-linear-to-r  from-[red] to-[blue] w-full "></div>
    </div>
  );
};

export default HomePage;
