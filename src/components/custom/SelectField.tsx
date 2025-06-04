import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface SelectFieldProps {
  id: string;
  label?: string;
  value: string;
  options: { label: string; value: string }[];
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
  touched?: boolean;
}

export const SelectField = ({
  id,
  label,
  value,
  options,
  onValueChange,
  placeholder,
  className = "",
  error,
  touched,
}: SelectFieldProps) => {
  const isError = touched && error;
  return (
    <div className={`w-full ${className}`}>
      <Label htmlFor={id} className="mb-2 block">
        {label}
      </Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger
          id={id}
          className={isError ? "border-red-500 focus:ring-red-500" : ""}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isError && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
