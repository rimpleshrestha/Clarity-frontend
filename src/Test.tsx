import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "./components/ui/label";
import { Loader2 } from "lucide-react";
import { Controller } from "react-hook-form";

interface CustomSelectProps {
  name: string;
  control: any;
  placeholder: string;
  data: any[];
  isLoading?: boolean;
  label?: string;
}

const CustomSelect = ({
  name,
  control,
  placeholder,
  data,
  isLoading = false,
  label = "How are you feeling?",
}: CustomSelectProps) => {
  console.log("CustomSelect data:", data);
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            onValueChange={field.onChange}
            value={field.value} // <-- KEEP ID HERE
          >
            <SelectTrigger className="w-[300px] bg-white">
              {field.value && data.find((item) => item.id == field.value)?.name}{" "}
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>

            <SelectContent>
              {isLoading ? (
                <span className="flex justify-center items-center py-2">
                  <Loader2 className="animate-spin text-muted-foreground" />
                </span>
              ) : (
                data?.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.icon ?? ""} {item.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
};

export default CustomSelect;
