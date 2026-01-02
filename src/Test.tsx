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
  isMulti?: boolean;
}

const CustomSelect = ({
  name,
  control,
  placeholder,
  data,
  isLoading = false,
  label = "Select an option",
  isMulti = false,
}: CustomSelectProps) => {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          // For multi-select, value is an array
          const valueArray = isMulti ? field.value || [] : field.value;

          const handleChange = (val: any) => {
            if (isMulti) {
              // toggle item in array
              if (valueArray.includes(val)) {
                field.onChange(valueArray.filter((v: any) => v !== val));
              } else {
                field.onChange([...valueArray, val]);
              }
            } else {
              field.onChange(val);
            }
          };

          return (
            <Select value={valueArray} onValueChange={handleChange}>
              <SelectTrigger className="w-[300px] bg-white">
                {isMulti
                  ? valueArray
                      .map((val: any) => {
                        const selected = data.find((item) => item.id == val);
                        return selected ? selected.name : null;
                      })
                      .join(", ")
                  : (() => {
                      const selected = data.find(
                        (item) => item.id == valueArray
                      );
                      return selected ? selected.name : null;
                    })()}

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
          );
        }}
      />
    </div>
  );
};

export default CustomSelect;
