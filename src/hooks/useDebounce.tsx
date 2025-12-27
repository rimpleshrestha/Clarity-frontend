import { useEffect, useState } from "react";

const useDebounce = ({ data, delay }: { data: string; delay: number }) => {
  const [debouncedData, setDebouncedData] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedData(data);
    }, delay);
    return () => clearTimeout(timer);
  }, [data, delay]);
  return debouncedData;
};

export default useDebounce;
