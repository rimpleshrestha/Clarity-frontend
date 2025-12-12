import { AlertCircle } from "lucide-react";

const Error = () => {
  return (
    <div className="flex min-h-screen justify-center flex-col items-center">
      <h1 className="font-semibold text-red-700 flex justify-center items-center gap-2  text-7xl">
        Error 404 <AlertCircle className="size-[60px]" />{" "}
      </h1>
      <span className="text-red-800 ">
        You were not supposed to see this screen something went wrong try again
      </span>
    </div>
  );
};

export default Error;
