import { X } from "lucide-react";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface MultiSelectFieldProps {
  id: string;
  label: string;
  value: string[];
  options: { label: string; value: string }[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  error?: string;
  touched?: boolean;
}

export const MultiSelectField = ({
  id,
  label,
  value,
  options,
  onChange,
  placeholder,
  className = "",
  error,
  touched,
}: MultiSelectFieldProps) => {
  const isError = touched && error;

  const handleSelect = (selectedValue: string) => {
    if (value.includes(selectedValue)) {
      onChange(value.filter((val) => val !== selectedValue));
    } else {
      onChange([...value, selectedValue]);
    }
  };

  const removeChip = (chipValue: string) => {
    onChange(value.filter((v) => v !== chipValue));
  };

  return (
    <div className={`w-full ${className}`}>
      <Label htmlFor={id} className="mb-2 block">
        {label}
      </Label>
      <Select onValueChange={handleSelect} value="">
        <SelectTrigger
          id={id}
          className={isError ? "border-red-500 focus:ring-red-500" : ""}
        >
          <SelectValue
            placeholder={
              value.length > 0
                ? value
                    .map((val) => {
                      const selectedOption = options.find(
                        (option) => option.value === val
                      );
                      return selectedOption ? selectedOption.label : val;
                    })
                    .join(", ")
                : placeholder
            }
          />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
              {value.includes(option.value) && " ✅"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {value.map((val) => {
            const optionLabel =
              options.find((opt) => opt.value === val)?.label || val;
            return (
              <div
                key={val}
                className="flex items-center justify-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-sm"
              >
                <div className="mb-[4px]">{optionLabel}</div>
                <button
                  type="button"
                  onClick={() => removeChip(val)}
                  className="focus:outline-none"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
      {isError && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
